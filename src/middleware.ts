import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // This function runs after authentication check
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow OAuth callback routes
        if (req.nextUrl.pathname.startsWith("/api/auth")) {
          return true;
        }
        
        // Require authentication for main page and API routes
        if (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/")) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/", // Protect main page
    "/api/:path*", // Protect all API routes
  ],
};