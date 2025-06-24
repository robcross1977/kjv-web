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
      const session = await auth();

      if (!session?.user?.id) {
        throw new Error("No authenticated user session found");
      }

      return session.user.id;
    },
    (error) => {
      return `Authentication failed: ${error}`;
    }
  );
