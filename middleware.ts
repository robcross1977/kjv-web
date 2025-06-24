import { auth } from "./auth";
import { NextRequest } from "next/server";

export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
  // The auth() wrapper will handle authentication automatically
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
