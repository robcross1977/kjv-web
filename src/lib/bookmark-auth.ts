import { NextRequest } from "next/server";
import * as TE from "fp-ts/TaskEither";
import { auth } from "../../auth";

/**
 * Gets authenticated user ID from NextAuth.js v5 session
 * Compatible with Next.js 15 and uses functional programming patterns
 */
export const getAuthenticatedUserId = (
  request: NextRequest
): TE.TaskEither<string, string> =>
  TE.tryCatch(
    async () => {
      console.log("AUTH DEBUG: Starting NextAuth.js v5 authentication check");

      const session = await auth();

      if (!session?.user?.id) {
        throw new Error("No authenticated user session found");
      }

      console.log("AUTH DEBUG: User authenticated:", session.user.id);
      return session.user.id;
    },
    (error) => {
      console.log("AUTH DEBUG: Authentication failed:", error);
      return `Authentication failed: ${error}`;
    }
  );
