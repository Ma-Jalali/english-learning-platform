"""Dependency-light structural checks for the isolated approval surface.

Run from the repository root: python3 design/phase-0c/catalogue-v3-validate.py
This is structural validation, not a substitute for browser/accessibility review.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
VOID = set("area base br col embed hr img input link meta param source track wbr".split())


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.ids, self.refs, self.labels = [], set(), [], []
        self.headings = 0

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if "id" in data:
            assert data["id"] not in self.ids, f"Duplicate ID: {data['id']}"
            self.ids.add(data["id"])
        for attr in ("src", "href"):
            if data.get(attr):
                self.refs.append(data[attr])
        for attr in ("aria-labelledby", "aria-describedby"):
            self.labels.extend(data.get(attr, "").split())
        if tag == "img":
            assert "alt" in data, "Image missing alt"
        if tag == "h1":
            self.headings += 1
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        assert self.stack and self.stack[-1] == tag, f"Invalid nesting: {tag}; {self.stack}"
        self.stack.pop()


page = Page()
html = (ROOT / "catalogue-v3.html").read_text()
page.feed(html)
assert not page.stack and page.headings == 1
assert '<html lang="en">' in html and 'name="viewport"' in html
assert set(page.labels) <= page.ids, "Unresolved accessible name reference"
for ref in page.refs:
    url = urlsplit(ref)
    assert not url.scheme and not url.netloc, f"Unexpected remote dependency: {ref}"
    target = ROOT / unquote(url.path) if url.path else ROOT / "catalogue-v3.html"
    assert target.is_file(), f"Missing local file: {ref}"
    if url.fragment:
        source = target.read_text()
        assert re.search(r'\bid=["\']' + re.escape(url.fragment) + r'["\']', source), f"Missing anchor: {ref}"

assets = sorted((ROOT / "assets").glob("catalogue-v3-*.svg"))
for asset in assets:
    tree = ET.parse(asset)
    ids = [e.attrib["id"] for e in tree.iter() if "id" in e.attrib]
    assert len(ids) == len(set(ids)), f"Duplicate SVG IDs: {asset.name}"
    for element in tree.iter():
        assert element.tag.split("}")[-1] not in {"script", "foreignObject"}
        for key, value in element.attrib.items():
            assert not key.startswith("on"), "Unexpected SVG event handler"
            for ref in re.findall(r"url\(#([^)]*)\)", value):
                assert ref in ids, f"Unresolved paint/filter: {ref}"
    assert asset.stat().st_size < 100_000

css_path = ROOT / "catalogue-v3.css"
css = css_path.read_text()
defined = set(re.findall(r"(--[\w-]+)\s*:", css))
used = set(re.findall(r"var\((--[\w-]+)", css))
assert used <= defined, f"Undefined spacing/style tokens: {used - defined}"
assert "@import" not in css, "Unexpected shared cascade dependency"
subprocess.run(["node", "-e", "const fs=require('fs'),p=require('postcss');const r=p.parse(fs.readFileSync(process.argv[1],'utf8'));let n=0;r.walkDecls(()=>n++);console.log('CSS parsed:',n,'declarations');", str(css_path)], check=True)
subprocess.run(["node", "--check", str(ROOT / "catalogue-v3.js")], check=True)


def luminance(hex_colour):
    channels = [int(hex_colour[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in channels]
    return sum(c * w for c, w in zip(linear, (.2126, .7152, .0722)))


for label, fg, bg, minimum in [
    ("White on primary orange", "#ffffff", "#c44216", 4.5),
    ("Ink on porcelain", "#171714", "#fffefd", 4.5),
    ("Muted text on canvas", "#625d61", "#f5f5f7", 4.5),
    ("Plum / focus on canvas", "#5a345c", "#f5f5f7", 4.5),
    ("Control border on canvas", "#8b8589", "#f5f5f7", 3),
    ("Launch label on canvas", "#c44216", "#f5f5f7", 4.5),
]:
    light, dark = sorted((luminance(fg), luminance(bg)), reverse=True)
    ratio = (light + .05) / (dark + .05)
    assert ratio >= minimum, f"Contrast failure: {label}: {ratio:.2f}"
    print(f"{label}: {ratio:.2f}:1")

files = [ROOT / f"catalogue-v3.{ext}" for ext in ("html", "css", "js")] + assets
print(f"PASS: HTML nesting, unique IDs, {len(page.refs)} local references, ARIA references, CSS structure/tokens, JS syntax, {len(assets)} SVG XML files")
print(f"Page + CSS + JS + SVG source: {sum(f.stat().st_size for f in files):,} bytes")
