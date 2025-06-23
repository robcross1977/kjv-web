import { NextRequest } from "next/server";
import * as TE from "fp-ts/TaskEither";
import { auth0 } from "@/lib/auth0";

/**
 * Gets authenticated user ID from Auth0 session
 */
export const getAuthenticatedUserId = (
  request: NextRequest
): TE.TaskEither<string, string> =>
  TE.tryCatch(
    async () => {
      console.log("AUTH DEBUG: Starting authentication check");

      const session = await auth0.getSession();

      if (!session?.user?.sub) {
        throw new Error("No authenticated user session found");
      }

      console.log("AUTH DEBUG: User authenticated:", session.user.sub);
      return session.user.sub;
    },
    (error) => {
      console.log("AUTH DEBUG: Authentication failed:", error);
      return `Authentication failed: ${error}`;
    }
  );
