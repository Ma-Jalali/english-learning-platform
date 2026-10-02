import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const SESSION_CACHE_HEADERS = ["cache-control", "expires", "pragma"] as const;

function copySessionResponse(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));

  SESSION_CACHE_HEADERS.forEach((header) => {
    const value = source.headers.get(header);

    if (value) {
      target.headers.set(header, value);
    }
  });

  return target;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([name, value]) => {
            supabaseResponse.headers.set(name, value);
          });
        },
      },
    },
  );

  // getClaims verifies the access token and refreshes it when required. Do not
  // replace this with getSession, which does not verify cookie-backed identity.
  const { data } = await supabase.auth.getClaims();
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (!data?.claims && isDashboardRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.search = "";

    const redirectResponse = copySessionResponse(
      supabaseResponse,
      NextResponse.redirect(loginUrl),
    );

    redirectResponse.headers.set("Cache-Control", "private, no-store");
    return redirectResponse;
  }

  return supabaseResponse;
}
