import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // This updates the session (refreshing tokens if needed)
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     * - api/ (API routes - handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|api/).*)",
  ],
};