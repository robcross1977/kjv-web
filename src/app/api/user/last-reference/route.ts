import { NextRequest, NextResponse } from "next/server";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import prisma from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/bookmark-auth";

/**
 * Validates if a Bible reference string is properly formatted
 * Allows empty strings for clearing the reference
 */
const validateReference = (reference: string): E.Either<string, string> =>
  pipe(
    reference.trim(),
    (ref) => ref.length >= 0 && ref.length <= 100, // Allow empty strings for clearing
    (isValid) =>
      isValid ? E.right(reference.trim()) : E.left("Invalid reference format")
  );

/**
 * Retrieves user's last reference from database
 */
const getLastReference = (
  userId: string
): TE.TaskEither<string, string | null> =>
  TE.tryCatch(
    async () => {
      const user = await prisma.user.findUnique({
        where: { uid: userId },
        select: { lastReference: true },
      });
      return user?.lastReference || null;
    },
    (error) => `Database error: ${error}`
  );

/**
 * Updates user's last reference in database
 */
const updateLastReference = (
  userId: string,
  reference: string
): TE.TaskEither<string, string> =>
  TE.tryCatch(
    async () => {
      // Use upsert to create user record if it doesn't exist
      // We only need uid and lastReference - email will be null
      await prisma.user.upsert({
        where: { uid: userId },
        update: { lastReference: reference },
        create: {
          uid: userId,
          lastReference: reference,
        },
      });
      return reference;
    },
    (error) => `Database error: ${error}`
  );

/**
 * GET /api/user/last-reference
 * Retrieves the user's last visited Bible reference
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain(getLastReference)
  )();

  return pipe(
    result,
    E.fold(
      (error) =>
        NextResponse.json(
          {
            success: false,
            lastReference: null,
            message: error,
          },
          { status: error.includes("Authentication") ? 401 : 500 }
        ),
      (lastReference) =>
        NextResponse.json({
          success: true,
          lastReference,
          message: lastReference
            ? "Last reference retrieved"
            : "No last reference found",
        } as {
          success: boolean;
          lastReference: string | null;
          message: string;
        })
    )
  );
}

/**
 * POST /api/user/last-reference
 * Updates the user's last visited Bible reference
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain((userId) =>
      pipe(
        TE.tryCatch(
          async () => {
            const body = await request.json();
            return body.reference;
          },
          () => "Failed to parse request body"
        ),
        TE.chainEitherK(validateReference),
        TE.chain((reference) => updateLastReference(userId, reference))
      )
    )
  )();

  return pipe(
    result,
    E.fold(
      (error) =>
        NextResponse.json(
          {
            success: false,
            lastReference: null,
            message: error,
          },
          { status: error.includes("Authentication") ? 401 : 400 }
        ),
      (reference) =>
        NextResponse.json({
          success: true,
          lastReference: reference,
          message: "Last reference updated successfully",
        } as any)
    )
  );
}
