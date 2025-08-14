import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated and trying to access signin page, redirect to home
    if (req.nextUrl.pathname === "/signin" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth-related routes
        if (req.nextUrl.pathname.startsWith("/api/auth")) {
          return true;
        }
        
        // Require authentication for protected routes
        if (req.nextUrl.pathname.startsWith("/api/") && !req.nextUrl.pathname.startsWith("/api/auth")) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/api/:path*",
    "/signin",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};