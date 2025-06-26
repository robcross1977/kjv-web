import { search } from "kingjames";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";

/**
 * Parsed reference structure for bookmark compatibility
 */
export type ParsedReference = {
  book: string;
  startChapter: number;
  endChapter?: number;
  startVerse?: number;
  endVerse?: number;
  originalInput: string;
  normalizedDisplay: string;
};

/**
 * Parse a reference using kingjames library and return bookmark-compatible structure
 */
export const parseReference = (input: string): E.Either<string, ParsedReference> => {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return E.left("Reference cannot be empty");
  }

  // Use kingjames search function
  const searchResults = search(trimmed);
  
  if (searchResults.type === "none" || Object.keys(searchResults.records).length === 0) {
    return E.left(`Invalid reference format: \${trimmed}`);
  }

  // Extract the first result to create ParsedReference structure
  const books = Object.keys(searchResults.records);
  const firstBook = books[0];
  const chapters = Object.keys(searchResults.records[firstBook]);
  const firstChapter = parseInt(chapters[0]);
  
  const verses = Object.keys(searchResults.records[firstBook][firstChapter]);
  const firstVerse = verses.length > 0 ? parseInt(verses[0]) : undefined;
  const lastVerse = verses.length > 1 ? parseInt(verses[verses.length - 1]) : undefined;

  // For multiple chapters, find the range
  const lastChapter = chapters.length > 1 ? parseInt(chapters[chapters.length - 1]) : undefined;

  return E.right({
    book: firstBook,
    startChapter: firstChapter,
    endChapter: lastChapter,
    startVerse: firstVerse,
    endVerse: lastVerse && lastVerse !== firstVerse ? lastVerse : undefined,
    originalInput: trimmed,
    normalizedDisplay: trimmed, // kingjames handles normalization
  });
};

/**
 * Basic validation (kingjames already validates, so this is mostly a pass-through)
 */
export const validateReference = (parsed: ParsedReference): E.Either<string, ParsedReference> => {
  // kingjames library already validated this, so we can trust it
  return E.right(parsed);
};

/**
 * Determine if input is a Bible reference using the kingjames library
 * Returns true if the kingjames search returns valid results, false otherwise
 */
export const isBibleReference = (input: string): boolean => {
  const trimmed = input.trim();

  // Empty input is not a reference
  if (!trimmed) return false;

  // Use kingjames search function to determine if it's a valid reference
  const searchResults = search(trimmed);
  
  // If search returns results with records, it's a valid reference
  return searchResults.type !== "none" && Object.keys(searchResults.records).length > 0;
};

/**
 * Smart search router: uses kingjames library to determine if input is a valid Bible reference
 * Returns 'reference' for parseable Bible references, 'ai' for everything else
 */
export const getSearchType = (input: string): "reference" | "ai" => {
  return isBibleReference(input) ? "reference" : "ai";
};
