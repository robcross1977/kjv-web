import * as TE from "fp-ts/TaskEither";
import { PrismaClient } from "@prisma/client";
import {
  type BookmarkListResponse,
  type CreateBookmarkRequest,
  type BookmarkSearchParams,
} from "@/types/bookmark";

const prisma = new PrismaClient();

/**
 * Builds Prisma where clause from search parameters
 */
export const buildWhereClause = (
  params: BookmarkSearchParams,
  userId: string
) => {
  const where: any = { userId };

  if (params.query) {
    where.OR = [
      { name: { contains: params.query, mode: "insensitive" } },
      { description: { contains: params.query, mode: "insensitive" } },
      { normalizedRef: { contains: params.query, mode: "insensitive" } },
    ];
  }

  if (params.book) {
    where.book = { equals: params.book, mode: "insensitive" };
  }

  if (params.category) {
    where.category = params.category;
  }

  if (params.tags && params.tags.length > 0) {
    where.tags = { hasSome: params.tags };
  }

  return where;
};

/**
 * Fetches bookmarks with pagination
 */
export const fetchBookmarks = (
  params: BookmarkSearchParams,
  userId: string
): TE.TaskEither<string, BookmarkListResponse> =>
  TE.tryCatch(
    async () => {
      const where = buildWhereClause(params, userId);
      const skip = (params.page - 1) * params.limit;

      const [total, bookmarks] = await Promise.all([
        prisma.bookmark.count({ where }),
        prisma.bookmark.findMany({
          where,
          orderBy: { [params.sortBy]: params.sortOrder },
          skip,
          take: params.limit,
        }),
      ]);

      return {
        bookmarks: bookmarks.map((bookmark) => ({
          ...bookmark,
          createdAt: bookmark.createdAt.toISOString(),
          updatedAt: bookmark.updatedAt.toISOString(),
          lastAccessed: bookmark.lastAccessed?.toISOString(),
        })),
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
      };
    },
    (error) => `Error fetching bookmarks: ${error}`
  );

/**
 * Ensures user exists in database
 */
export const ensureUserExists = (userId: string): TE.TaskEither<string, void> =>
  TE.tryCatch(
    async () => {
      await prisma.user.upsert({
        where: { uid: userId },
        update: {},
        create: {
          uid: userId,
          email: "user@example.com", // This will be updated by Auth0 webhook
          name: "User",
        },
      });
    },
    (error) => `Failed to ensure user exists: ${error}`
  );

/**
 * Checks if bookmark name already exists for user
 */
export const checkBookmarkNameExists = (
  userId: string,
  name: string
): TE.TaskEither<string, boolean> =>
  TE.tryCatch(
    async () => {
      const existing = await prisma.bookmark.findUnique({
        where: { userId_name: { userId, name } },
      });
      return !!existing;
    },
    (error) => `Failed to check bookmark name: ${error}`
  );

/**
 * Creates a new bookmark in the database
 */
export const createBookmarkInDb = (
  data: CreateBookmarkRequest,
  parsedRef: any,
  userId: string
): TE.TaskEither<string, any> =>
  TE.tryCatch(
    async () => {
      const bookmark = await prisma.bookmark.create({
        data: {
          userId,
          name: data.name,
          description: data.description,
          book: parsedRef.book,
          startChapter: parsedRef.startChapter,
          endChapter: parsedRef.endChapter,
          startVerse: parsedRef.startVerse,
          endVerse: parsedRef.endVerse,
          originalRef: parsedRef.originalInput,
          normalizedRef: parsedRef.normalizedDisplay,
          tags: data.tags,
          category: data.category,
          color: data.color,
        },
      });

      return {
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
        updatedAt: bookmark.updatedAt.toISOString(),
        lastAccessed: bookmark.lastAccessed?.toISOString(),
      };
    },
    (error) => `Failed to create bookmark: ${error}`
  );

/**
 * Finds a bookmark by ID and user ID
 */
export const findBookmarkByIdAndUser = (
  id: string,
  userId: string
): TE.TaskEither<string, any> =>
  TE.tryCatch(
    async () => {
      const bookmark = await prisma.bookmark.findFirst({
        where: { id, userId },
      });

      if (!bookmark) {
        throw new Error("Bookmark not found or access denied");
      }

      return bookmark;
    },
    (error) => `Error finding bookmark: ${error}`
  );

/**
 * Updates a bookmark in the database
 */
export const updateBookmarkInDb = (
  id: string,
  updateData: any
): TE.TaskEither<string, any> =>
  TE.tryCatch(
    async () => {
      const bookmark = await prisma.bookmark.update({
        where: { id },
        data: updateData,
      });

      return {
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
        updatedAt: bookmark.updatedAt.toISOString(),
        lastAccessed: bookmark.lastAccessed?.toISOString(),
      };
    },
    (error) => `Failed to update bookmark: ${error}`
  );

/**
 * Deletes a bookmark from the database
 */
export const deleteBookmarkFromDb = (id: string): TE.TaskEither<string, void> =>
  TE.tryCatch(
    async () => {
      await prisma.bookmark.delete({
        where: { id },
      });
    },
    (error) => `Failed to delete bookmark: ${error}`
  );

/**
 * Increments bookmark access count and updates last accessed
 */
export const incrementBookmarkAccess = (
  id: string
): TE.TaskEither<string, any> =>
  TE.tryCatch(
    async () => {
      const bookmark = await prisma.bookmark.update({
        where: { id },
        data: {
          accessCount: { increment: 1 },
          lastAccessed: new Date(),
        },
      });

      return {
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
        updatedAt: bookmark.updatedAt.toISOString(),
        lastAccessed: bookmark.lastAccessed?.toISOString(),
      };
    },
    (error) => `Failed to increment bookmark access: ${error}`
  );
