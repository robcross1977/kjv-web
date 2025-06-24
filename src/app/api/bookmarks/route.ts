import { NextRequest } from "next/server";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { getAuthenticatedUserId } from "@/lib/bookmark-auth";
import {
  parseSearchParams,
  validateBookmarkReference,
  validateCreateBookmarkRequest,
} from "@/lib/bookmark-validation";
import {
  fetchBookmarks,
  ensureUserExists,
  checkBookmarkNameExists,
  createBookmarkInDb,
} from "@/lib/bookmark-db";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/bookmark-responses";

/**
 * GET /api/bookmarks - List user bookmarks with search and filtering
 */
export async function GET(request: NextRequest) {
  console.log("BOOKMARKS API ROUTE HIT - GET");
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain((userId) =>
      pipe(
        parseSearchParams(request.url),
        TE.fromEither,
        TE.chain((params) => fetchBookmarks(params, userId))
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
 * POST /api/bookmarks - Create a new bookmark
 */
export async function POST(request: NextRequest) {
  console.log("BOOKMARKS API ROUTE HIT - POST");
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain((userId) =>
      pipe(
        TE.tryCatch(
          () => request.json(),
          (error) => `Failed to parse request body: ${error}`
        ),
        TE.chainEitherK(validateCreateBookmarkRequest),
        TE.chainEitherK((data) =>
          pipe(
            validateBookmarkReference(data.reference),
            E.map((parsedRef) => ({ data, parsedRef }))
          )
        ),
        TE.chain(({ data, parsedRef }) =>
          pipe(
            ensureUserExists(userId),
            TE.chain(() => checkBookmarkNameExists(userId, data.name)),
            TE.chain((nameExists) =>
              nameExists
                ? TE.left(`Bookmark with name "${data.name}" already exists`)
                : TE.right(undefined)
            ),
            TE.chain(() => createBookmarkInDb(data, parsedRef, userId))
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
      (data) => createSuccessResponse(data, 201)
    )
  );
}
