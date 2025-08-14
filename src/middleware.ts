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
        
        // Allow signin page access (will be handled by the page component)
        if (req.nextUrl.pathname === "/signin") {
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
    "/signin", // Allow access but will handle redirects
    "/api/:path*", // Protect all API routes
  ],
};