import * as t from "io-ts";

/**
 * Core types for the mark as read system
 */

// Verse reference type
export const VerseReference = t.type({
  book: t.string,
  chapter: t.number,
  verse: t.number,
});

export type VerseReference = t.TypeOf<typeof VerseReference>;

// Read verse record from database
export const ReadVerse = t.type({
  id: t.string,
  book: t.string,
  chapter: t.number,
  verse: t.number,
  readAt: t.string, // ISO date string
  userId: t.string,
});

export type ReadVerse = t.TypeOf<typeof ReadVerse>;

// Read status for a verse (union type)
export type ReadStatus = "read" | "unread";

// Tools state management
export type ToolsState = {
  isActive: boolean;
  selectedVerses: Set<string>; // verse keys in format "book:chapter:verse"
};

// Verse selection state
export type VerseSelection = {
  verseKey: string; // "book:chapter:verse"
  isSelected: boolean;
};

// Bulk action types
export type BulkAction =
  | "mark-read"
  | "mark-unread"
  | "select-all"
  | "deselect-all";

// API request/response types
export type MarkReadRequest = {
  verses: VerseReference[];
};

export type MarkReadResponse = {
  userId: string;
  markedCount: number;
  verses: VerseReference[];
  timestamp: string;
};

export type ReadStatusRequest = {
  book: string;
  chapter: number;
  verses: number[];
};

export type ReadStatusResponse = {
  userId: string;
  book: string;
  chapter: number;
  verses: number[];
  readVerses: ReadVerse[];
};

// Utility functions for verse keys
export const createVerseKey = (
  book: string,
  chapter: number,
  verse: number
): string => `${book}:${chapter}:${verse}`;

export const parseVerseKey = (key: string): VerseReference | null => {
  const parts = key.split(":");
  if (parts.length !== 3) return null;

  const [book, chapterStr, verseStr] = parts;
  const chapter = parseInt(chapterStr);
  const verse = parseInt(verseStr);

  if (isNaN(chapter) || isNaN(verse)) return null;

  return { book, chapter, verse };
};
