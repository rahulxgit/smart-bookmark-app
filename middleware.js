import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const response = NextResponse.next();

  try {
    // Create Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: "",
              ...options,
              maxAge: 0,
            });
          },
        },
      }
    );

    // Refresh session + get user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect dashboard routes
    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return response; // fail gracefully
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
