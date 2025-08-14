import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // This function runs after authentication check
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Require authentication for main page and API routes
        return !!token;
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