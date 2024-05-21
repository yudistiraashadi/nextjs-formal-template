import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/db/supabase/server";

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    ///////////////////
    // Check session //
    ///////////////////

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // not signed in / session expired
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
