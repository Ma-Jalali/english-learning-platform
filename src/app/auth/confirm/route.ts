import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function getSafeRedirect(requestUrl: URL) {
  const requestedPath = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!requestedPath.startsWith("/") || requestedPath.startsWith("//")) {
    return new URL("/dashboard", requestUrl.origin);
  }

  const redirectUrl = new URL(requestedPath, requestUrl.origin);

  return redirectUrl.origin === requestUrl.origin
    ? redirectUrl
    : new URL("/dashboard", requestUrl.origin);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(getSafeRedirect(requestUrl));
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  }

  const loginUrl = new URL("/auth/login", requestUrl.origin);
  loginUrl.searchParams.set("error", "confirmation");

  const response = NextResponse.redirect(loginUrl);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
