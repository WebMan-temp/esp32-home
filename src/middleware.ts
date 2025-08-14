export { default } from "next-auth/middleware";
// Protect home and API; leave /signin and /api/auth/* public
export const config = { matcher: ["/", "/api/:path*"] };