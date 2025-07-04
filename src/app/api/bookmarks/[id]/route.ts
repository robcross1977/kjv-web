import { NextRequest } from "next/server";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { UpdateBookmarkSchema } from "@/types/bookmark";
import { getAuthenticatedUserId } from "@/lib/bookmark-auth";
import { validateBookmarkReference } from "@/lib/bookmark-validation";
import {
  findBookmarkByIdAndUser,
  updateBookmarkInDb,
  deleteBookmarkFromDb,
  incrementBookmarkAccess,
  checkBookmarkNameExists,
} from "@/lib/bookmark-db";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/bookmark-responses";

/**
 * Validates update bookmark request body
 */
const validateUpdateBookmarkRequest = (body: unknown) =>
  E.tryCatch(
    () => UpdateBookmarkSchema.parse(body),
    (error) => `Invalid request body: ${error}`
  );

/**
 * Builds update data object from validated request
 */
const buildUpdateData = (
  validatedData: any,
  existingBookmark: any,
  userId: string
): TE.TaskEither<string, any> =>
  pipe(
    // Handle name update with conflict checking
    validatedData.name !== undefined &&
      validatedData.name !== existingBookmark.name
      ? pipe(
          checkBookmarkNameExists(userId, validatedData.name),
          TE.chain((nameExists) =>
            nameExists
              ? TE.left(
                  `Bookmark with name "${validatedData.name}" already exists`
                )
              : TE.right(undefined)
          )
        )
      : TE.right(undefined),
    TE.chain(() =>
      // Handle reference update
      validatedData.reference !== undefined
        ? pipe(
            validateBookmarkReference(validatedData.reference),
            TE.fromEither,
            TE.map((ref) => ({
              book: ref.book,
              startChapter: ref.startChapter,
              endChapter: ref.endChapter,
              startVerse: ref.startVerse,
              endVerse: ref.endVerse,
              originalRef: ref.originalInput,
              normalizedRef: ref.normalizedDisplay,
            }))
          )
        : TE.right({})
    ),
    TE.map((refData) => ({
      ...refData,
      ...(validatedData.name !== undefined && { name: validatedData.name }),
      ...(validatedData.description !== undefined && {
        description: validatedData.description,
      }),
      ...(validatedData.tags !== undefined && { tags: validatedData.tags }),
      ...(validatedData.category !== undefined && {
        category: validatedData.category,
      }),
      ...(validatedData.color !== undefined && {
        color: validatedData.color,
      }),
      ...(validatedData.folderId !== undefined && {
        folderId: validatedData.folderId,
      }),
    }))
  );

/**
 * PUT /api/bookmarks/[id] - Update a bookmark
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain((userId) =>
      pipe(
        TE.tryCatch(
          () => request.json(),
          (error) => `Failed to parse request body: ${error}`
        ),
        TE.chainEitherK(validateUpdateBookmarkRequest),
        TE.chain((validatedData) =>
          pipe(
            findBookmarkByIdAndUser(id, userId),
            TE.chain((existingBookmark) =>
              pipe(
                buildUpdateData(validatedData, existingBookmark, userId),
                TE.chain((updateData) => updateBookmarkInDb(id, updateData))
              )
            )
          )
        )
      )
    )
  )();

  return pipe(
    result,
    E.fold(
      (error) =>
        createErrorResponse(
          error,
          error.includes("Authentication") ? 401 : 400
        ),
      (data) => createSuccessResponse(data)
    )
  );
}

/**
 * DELETE /api/bookmarks/[id] - Delete a bookmark
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain((userId) =>
      pipe(
        findBookmarkByIdAndUser(id, userId),
        TE.chain(() => deleteBookmarkFromDb(id)),
        TE.map(() => ({
          success: true,
          message: "Bookmark deleted successfully",
        }))
      )
    )
  )();

  return pipe(
    result,
    E.fold(
      (error) =>
        createErrorResponse(
          error,
          error.includes("Authentication") ? 401 : 400
        ),
      (data) => createSuccessResponse(data)
    )
  );
}

/**
 * GET /api/bookmarks/[id] - Get a single bookmark and increment access count
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain((userId) =>
      pipe(
        findBookmarkByIdAndUser(id, userId),
        TE.chain(() => incrementBookmarkAccess(id))
      )
    )
  )();

  return pipe(
    result,
    E.fold(
      (error) =>
        createErrorResponse(
          error,
          error.includes("Authentication") ? 401 : 400
        ),
      (data) => createSuccessResponse(data)
    )
  );
}
