import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/bookmark-auth";
import prisma from "@/lib/prisma";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { calculateReadingProgress } from "@/lib/bible-stats";

/**
 * GET /api/user/reading-progress
 * Get the user's overall Bible reading progress
 */
export async function GET(request: NextRequest) {
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain((userId) =>
      TE.tryCatch(
        async () => {
          // Count total read verses for the user
          const readVersesCount = await prisma.readVerse.count({
            where: {
              userId: userId,
            },
          });

          // Calculate progress percentage
          const progressPercentage = calculateReadingProgress(readVersesCount);

          return {
            readVersesCount,
            progressPercentage,
            userId: userId,
          };
        },
        (error) => `Failed to fetch reading progress: ${String(error)}`
      )
    )
  )();

  if (E.isLeft(result)) {
    return NextResponse.json({ error: result.left }, { status: 500 });
  }

  return NextResponse.json(result.right);
}
