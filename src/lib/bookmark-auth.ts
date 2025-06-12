import { NextRequest } from "next/server";
import * as TE from "fp-ts/TaskEither";
import { auth0 } from "@/lib/auth0";

/**
 * Gets authenticated user ID from session
 */
export const getAuthenticatedUserId = (
  request: NextRequest
): TE.TaskEither<string, string> =>
  TE.tryCatch(
    async () => {
      const session = await auth0.getSession(request);
      if (!session?.user?.sub) {
        throw new Error("User not authenticated");
      }
      return session.user.sub;
    },
    (error) => `Authentication failed: ${error}`
  );
