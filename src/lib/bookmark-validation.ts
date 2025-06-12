import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import {
  CreateBookmarkSchema,
  BookmarkSearchSchema,
  type BookmarkSearchParams,
} from "@/types/bookmark";
import { parseReference, validateReference } from "@/lib/reference-parser";

/**
 * Parses URL search parameters into validated search params
 */
export const parseSearchParams = (
  url: string
): E.Either<string, BookmarkSearchParams> =>
  pipe(
    E.tryCatch(
      () => {
        const { searchParams } = new URL(url);
        return {
          query: searchParams.get("query") || undefined,
          book: searchParams.get("book") || undefined,
          category: searchParams.get("category") || undefined,
          tags:
            searchParams.get("tags")?.split(",").filter(Boolean) || undefined,
          sortBy: searchParams.get("sortBy") || "createdAt",
          sortOrder: searchParams.get("sortOrder") || "desc",
          page: parseInt(searchParams.get("page") || "1"),
          limit: parseInt(searchParams.get("limit") || "20"),
        };
      },
      (error) => `Failed to parse search parameters: ${error}`
    ),
    E.chain((data) =>
      E.tryCatch(
        () => BookmarkSearchSchema.parse(data),
        (error) => `Invalid search parameters: ${error}`
      )
    )
  );

/**
 * Validates and parses bookmark reference
 */
export const validateBookmarkReference = (reference: string) =>
  pipe(
    parseReference(reference),
    E.chain(validateReference),
    E.mapLeft((error) => `Invalid reference: ${error}`)
  );

/**
 * Validates create bookmark request body
 */
export const validateCreateBookmarkRequest = (body: unknown) =>
  E.tryCatch(
    () => CreateBookmarkSchema.parse(body),
    (error) => `Invalid request body: ${error}`
  );
