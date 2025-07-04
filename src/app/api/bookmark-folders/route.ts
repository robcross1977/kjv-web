import { NextRequest, NextResponse } from "next/server";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { CreateBookmarkFolderSchema } from "@/types/bookmark-folder";
import { getAuthenticatedUserId } from "@/lib/bookmark-auth";
import prisma from "@/lib/prisma";

/**
 * Validates create folder request body
 */
const validateCreateFolderRequest = (body: unknown) =>
  E.tryCatch(
    () => CreateBookmarkFolderSchema.parse(body),
    (error) => `Invalid request body: ${error}`
  );

/**
 * Creates a new bookmark folder
 */
const createFolderInDb = (
  data: any,
  userId: string
): TE.TaskEither<string, any> =>
  TE.tryCatch(
    async () => {
      // Check if folder name already exists in the same parent
      const existingFolder = await prisma.bookmarkFolder.findFirst({
        where: {
          userId,
          name: data.name,
          parentId: data.parentId || null,
        },
      });

      if (existingFolder) {
        throw new Error(
          `Folder with name "${data.name}" already exists in this location`
        );
      }

      // If parentId is provided, verify it exists and belongs to the user
      if (data.parentId) {
        const parentFolder = await prisma.bookmarkFolder.findFirst({
          where: {
            id: data.parentId,
            userId,
          },
        });

        if (!parentFolder) {
          throw new Error("Parent folder not found or access denied");
        }
      }

      const folder = await prisma.bookmarkFolder.create({
        data: {
          userId,
          name: data.name,
          description: data.description,
          color: data.color,
          parentId: data.parentId || null,
        },
        include: {
          _count: {
            select: {
              bookmarks: true,
              children: true,
            },
          },
        },
      });

      return {
        ...folder,
        createdAt: folder.createdAt.toISOString(),
        updatedAt: folder.updatedAt.toISOString(),
      };
    },
    (error) => `Failed to create folder: ${error}`
  );

/**
 * Gets all folders for a user with hierarchy
 */
const getFoldersForUser = (userId: string): TE.TaskEither<string, any[]> =>
  TE.tryCatch(
    async () => {
      const folders = await prisma.bookmarkFolder.findMany({
        where: { userId },
        include: {
          _count: {
            select: {
              bookmarks: true,
              children: true,
            },
          },
        },
        orderBy: [{ name: "asc" }],
      });

      return folders.map((folder) => ({
        ...folder,
        createdAt: folder.createdAt.toISOString(),
        updatedAt: folder.updatedAt.toISOString(),
      }));
    },
    (error) => `Failed to fetch folders: ${error}`
  );

/**
 * GET /api/bookmark-folders - Get all folders for authenticated user
 */
export async function GET(request: NextRequest) {
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain(getFoldersForUser)
  )();

  if (E.isLeft(result)) {
    return NextResponse.json({ error: result.left }, { status: 500 });
  }

  return NextResponse.json(result.right);
}

/**
 * POST /api/bookmark-folders - Create a new folder
 */
export async function POST(request: NextRequest) {
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain((userId) =>
      pipe(
        TE.tryCatch(
          () => request.json(),
          (error) => `Failed to parse request body: ${error}`
        ),
        TE.chainEitherK(validateCreateFolderRequest),
        TE.chain((validatedData) => createFolderInDb(validatedData, userId))
      )
    )
  )();

  if (E.isLeft(result)) {
    return NextResponse.json({ error: result.left }, { status: 400 });
  }

  return NextResponse.json(result.right, { status: 201 });
}
