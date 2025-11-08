import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (!hasEnvVars) return supabaseResponse;

  // --- SKIP middleware for static/next built assets and common public files ---
  const p = request.nextUrl.pathname;
  if (
    p.startsWith("/_next") ||
    p.startsWith("/static") ||
    p.startsWith("/src") || // some packages request /src in dev
    p === "/favicon.ico" ||
    p === "/robots.txt" ||
    p.startsWith("/public")
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth",
    "/about",
    "/contact",
    "/shipping",
    "/returns",
    "/privacy",
    "/products",
    "/unauthorized",
  ];

  const isPublic = publicRoutes.some((route) =>
    route === "/"
      ? p === "/" || p === "/"
      : p === route || p.startsWith(route + "/")
  );

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user && (p === "/login" || p === "/auth/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
