// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Public routes
//   if (
//     pathname === "/" ||
//     pathname.startsWith("/auth") ||
//     pathname.startsWith("/inquiry")
//   ) {
//     return NextResponse.next();
//   }

//   // Get auth token
//   const token = req.cookies.get("sb-access-token")?.value;
//   if (!token) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // Get user
//   const {
//     data: { user },
//   } = await supabase.auth.getUser(token);

//   if (!user) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // Fetch role
//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", user.id)
//     .single();

//   const role = profile?.role;

//   // Role-based access
//   if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN")
//     return NextResponse.redirect(new URL("/unauthorized", req.url));

//   if (pathname.startsWith("/branch") && role !== "BRANCH_ADMIN")
//     return NextResponse.redirect(new URL("/unauthorized", req.url));

//   if (pathname.startsWith("/reception") && role !== "RECEPTIONIST")
//     return NextResponse.redirect(new URL("/unauthorized", req.url));

//   if (pathname.startsWith("/counselor") && role !== "COUNSELOR")
//     return NextResponse.redirect(new URL("/unauthorized", req.url));

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/branch/:path*",
//     "/reception/:path*",
//     "/counselor/:path*",
//   ],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // Public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/inquiry")
  ) {
    return res;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Fetch role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;

  // Role-based access
  if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN")
    return NextResponse.redirect(new URL("/unauthorized", req.url));

  if (pathname.startsWith("/branch") && role !== "BRANCH_ADMIN")
    return NextResponse.redirect(new URL("/unauthorized", req.url));

  if (pathname.startsWith("/reception") && role !== "RECEPTIONIST")
    return NextResponse.redirect(new URL("/unauthorized", req.url));

  if (pathname.startsWith("/counselor") && role !== "COUNSELOR")
    return NextResponse.redirect(new URL("/unauthorized", req.url));

  return res;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/branch/:path*",
    "/reception/:path*",
    "/counselor/:path*",
  ],
};
