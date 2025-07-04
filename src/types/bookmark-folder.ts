import { z } from "zod";

/**
 * BookmarkFolder model from Prisma
 */
export type BookmarkFolder = {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  parentId?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Optional nested data
  children?: BookmarkFolder[];
  parent?: BookmarkFolder | null;
  _count?: {
    bookmarks: number;
    children: number;
  };
};

/**
 * Request schema for creating a bookmark folder
 */
export const CreateBookmarkFolderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(100, "Folder name too long"),
  description: z.string().max(500, "Description too long").optional(),
  color: z.string().optional(),
  parentId: z.string().optional(),
});

export type CreateBookmarkFolderRequest = z.infer<
  typeof CreateBookmarkFolderSchema
>;

/**
 * Request schema for updating a bookmark folder
 */
export const UpdateBookmarkFolderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(100, "Folder name too long")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
  color: z.string().optional(),
  parentId: z.string().optional(),
});

export type UpdateBookmarkFolderRequest = z.infer<
  typeof UpdateBookmarkFolderSchema
>;

/**
 * Folder tree structure for hierarchical display
 */
export type FolderTreeNode = {
  folder: BookmarkFolder;
  children: FolderTreeNode[];
  bookmarkCount: number;
  totalBookmarkCount: number; // Including nested folders
};

/**
 * Search parameters for folders
 */
export type FolderSearchParams = {
  search?: string;
  parentId?: string | null; // null for root level, string for specific parent
  includeEmpty?: boolean;
};
