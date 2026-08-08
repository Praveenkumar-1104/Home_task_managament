import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages that are reachable without being logged in.
const PUBLIC_PATHS = ["/", "/login"];

// Refreshes the Supabase auth session on every request and enforces access:
// - logged-out users are redirected to /login (except on public pages / APIs)
// - logged-in users on an auth page are redirected to /dashboard
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // With Fluid compute, create a new client on each request (no globals).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and getClaims(). Getting this
  // wrong can randomly log users out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { pathname } = request.nextUrl;
  const isPublicPage = PUBLIC_PATHS.includes(pathname);
  const isApi = pathname.startsWith("/api");

  // Redirect while preserving any freshly-refreshed auth cookies.
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) => response.cookies.set(cookie));
    return response;
  };

  if (!user && !isPublicPage && !isApi) {
    return redirectTo("/login");
  }

  if (user && isPublicPage) {
    return redirectTo("/dashboard");
  }

  // IMPORTANT: return supabaseResponse as-is so request/response cookies stay in sync.
  return supabaseResponse;
}
