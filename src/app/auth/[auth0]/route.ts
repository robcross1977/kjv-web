import { auth0 } from "@/lib/auth0";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth0: string }> }
) {
  const { auth0: route } = await params;

  try {
    // Auth0 v4 uses the middleware method to handle all auth routes
    return await auth0.middleware(request);
  } catch (error) {
    console.error("Auth0 route error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
