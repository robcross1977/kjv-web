import { z } from "zod";

/**
 * Bookmark data structure matching the Prisma model
 */
export const BookmarkSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  book: z.string(),
  startChapter: z.number(),
  endChapter: z.number().nullable().optional(),
  startVerse: z.number().nullable().optional(),
  endVerse: z.number().nullable().optional(),
  originalRef: z.string(),
  normalizedRef: z.string(),
  tags: z.array(z.string()),
  category: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  folderId: z.string().nullable().optional(),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
  accessCount: z.number(),
  lastAccessed: z.string().optional(), // ISO date string
  userId: z.string(),
});

export type Bookmark = z.infer<typeof BookmarkSchema>;

/**
 * Request schema for creating a new bookmark
 */
export const CreateBookmarkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  reference: z.string().min(1, "Reference is required"),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  color: z.string().optional(),
  folderId: z.string().optional(), // New field for folder assignment
});

export type CreateBookmarkRequest = z.infer<typeof CreateBookmarkSchema>;

/**
 * Request schema for updating a bookmark
 */
export const UpdateBookmarkSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  reference: z.string().min(1, "Reference is required").optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  folderId: z.string().optional(), // New field for folder assignment
});

export type UpdateBookmarkRequest = z.infer<typeof UpdateBookmarkSchema>;

/**
 * Search and filter options for bookmarks
 */
export const BookmarkSearchSchema = z.object({
  query: z.string().optional(),
  book: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt", "accessCount", "book"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type BookmarkSearchParams = z.infer<typeof BookmarkSearchSchema>;

/**
 * Bookmark list response
 */
export const BookmarkListResponseSchema = z.object({
  bookmarks: z.array(BookmarkSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type BookmarkListResponse = z.infer<typeof BookmarkListResponseSchema>;

/**
 * Bookmark categories for organization
 */
export const BOOKMARK_CATEGORIES = [
  "Study",
  "Devotional",
  "Memorization",
  "Favorite",
  "Teaching",
  "Prayer",
  "Comfort",
  "Wisdom",
  "Prophecy",
  "History",
] as const;

export type BookmarkCategory = (typeof BOOKMARK_CATEGORIES)[number];

/**
 * Bookmark colors for visual organization
 */
export const BOOKMARK_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
] as const;

export type BookmarkColor = (typeof BOOKMARK_COLORS)[number];
