"""Structural checks for Catalogue V3 and its supporting approval surfaces."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
PAGES = (
    "catalogue.html", "bundle-builder.html", "my-mock-tests.html",
    "test-details.html", "pre-test-lobby.html", "attempt-results.html",
)
LINK_ONLY_PAGES = ("review-index.html",)
PAGE_CSS = ("bundles-v3.css", "library-v3.css", "journey-v3.css")
# Per-element values set inline in markup rather than defined in a stylesheet.
INLINE_TOKENS = {"--owned", "--new"}
VOID = set("area base br col embed hr img input link meta param source track wbr".split())


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.ids, self.refs, self.labels = [], set(), [], []
        self.h1s = 0

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
            self.h1s += 1
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        assert self.stack and self.stack[-1] == tag, f"Invalid nesting: {tag}; {self.stack}"
        self.stack.pop()


reference_count = 0
for page_name in PAGES:
    page = Page()
    html = (ROOT / page_name).read_text()
    page.feed(html)
    page.close()
    # attempt-results.html holds one illustrative view per journey state, each with its own h1.
    expected_h1s = html.count("data-journey-view=") if page_name == "attempt-results.html" else 1
    assert not page.stack and page.h1s == expected_h1s, f"Heading/nesting failure: {page_name}"
    assert '<html lang="en">' in html and 'name="viewport"' in html
    assert set(page.labels) <= page.ids, f"Unresolved ARIA reference: {page_name}"
    for ref in page.refs:
        url = urlsplit(ref)
        assert not url.scheme and not url.netloc, f"Unexpected remote dependency: {ref}"
        target = ROOT / unquote(url.path) if url.path else ROOT / page_name
        assert target.is_file(), f"Missing local file: {ref}"
        if url.fragment:
            source = target.read_text()
            assert re.search(r'\bid=["\']' + re.escape(url.fragment) + r'["\']', source), f"Missing anchor: {ref}"
    reference_count += len(page.refs)

# Internal review directory: local links and anchors only (it uses the earlier laboratory shell).
for page_name in LINK_ONLY_PAGES:
    page = Page()
    page.feed((ROOT / page_name).read_text())
    page.close()
    for ref in page.refs:
        url = urlsplit(ref)
        assert not url.scheme and not url.netloc, f"Unexpected remote dependency: {page_name} {ref}"
        target = ROOT / unquote(url.path) if url.path else ROOT / page_name
        assert target.is_file(), f"Missing local file: {page_name} {ref}"
        if url.fragment:
            assert re.search(r'\bid=["\']' + re.escape(url.fragment) + r'["\']', target.read_text()), f"Missing anchor: {page_name} {ref}"
    reference_count += len(page.refs)

assets = [ROOT / "assets" / name for name in (
    "catalogue-v3-mark.svg", "catalogue-v3-skills.svg", "process-choose.svg", "process-assign.svg", "process-library.svg"
)]
for asset in assets:
    tree = ET.parse(asset)
    ids = [element.attrib["id"] for element in tree.iter() if "id" in element.attrib]
    assert len(ids) == len(set(ids)), f"Duplicate SVG IDs: {asset.name}"
    root = tree.getroot()
    if asset.name.startswith("process-"):
        assert root.attrib.get("viewBox") == "0 0 400 240"
        assert root.attrib.get("width") == "800" and root.attrib.get("height") == "480"
    for element in tree.iter():
        assert element.tag.split("}")[-1] not in {"script", "foreignObject"}
        assert not any(key.startswith("on") for key in element.attrib)
    assert asset.stat().st_size < 100_000

catalogue_css = (ROOT / "catalogue-v3.css").read_text()
support_css_path = ROOT / "support-v3.css"
support_css = support_css_path.read_text()
defined = set(re.findall(r"(--[\w-]+)\s*:", catalogue_css + support_css))
used = set(re.findall(r"var\((--[\w-]+)", support_css))
assert used <= defined, f"Undefined design tokens: {used - defined}"
subprocess.run([
    "node", "-e",
    "const fs=require('fs'),p=require('postcss');const r=p.parse(fs.readFileSync(process.argv[1],'utf8'));let n=0;r.walkDecls(()=>n++);console.log('Support CSS parsed:',n,'declarations');",
    str(support_css_path),
], check=True)
for css_name in PAGE_CSS:
    page_css = (ROOT / css_name).read_text()
    page_defined = defined | set(re.findall(r"(--[\w-]+)\s*:", page_css)) | INLINE_TOKENS
    page_used = set(re.findall(r"var\((--[\w-]+)", page_css))
    assert page_used <= page_defined, f"Undefined design tokens in {css_name}: {page_used - page_defined}"
    subprocess.run([
        "node", "-e",
        "const fs=require('fs'),p=require('postcss');const r=p.parse(fs.readFileSync(process.argv[1],'utf8'));let n=0;r.walkDecls(()=>n++);console.log(process.argv[2]+' parsed:',n,'declarations');",
        str(ROOT / css_name), css_name,
    ], check=True)
for script in ("catalogue-v3.js", "prototype.js", "assessment-preview.js"):
    subprocess.run(["node", "--check", str(ROOT / script)], check=True)


def luminance(colour):
    channels = [int(colour[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in channels]
    return sum(c * weight for c, weight in zip(linear, (.2126, .7152, .0722)))


for label, fg, bg, minimum in (
    ("White on primary orange", "#ffffff", "#c44216", 4.5),
    ("Ink on porcelain", "#171714", "#fffefd", 4.5),
    ("Muted text on canvas", "#625d61", "#f5f5f7", 4.5),
    ("Plum focus on canvas", "#5a345c", "#f5f5f7", 4.5),
):
    light, dark = sorted((luminance(fg), luminance(bg)), reverse=True)
    ratio = (light + .05) / (dark + .05)
    assert ratio >= minimum, f"Contrast failure: {label}: {ratio:.2f}"
    print(f"{label}: {ratio:.2f}:1")

files = [ROOT / name for name in PAGES + LINK_ONLY_PAGES + ("support-v3.css",) + PAGE_CSS + ("assessment-preview.js",)] + assets
print(f"PASS: {len(PAGES)} HTML pages + {len(LINK_ONLY_PAGES)} link-checked review page, {reference_count} local references, ARIA references, {1 + len(PAGE_CSS)} CSS files, 3 JS files, {len(assets)} SVG files")
print(f"Revised-page source and assets: {sum(file.stat().st_size for file in files):,} bytes")
