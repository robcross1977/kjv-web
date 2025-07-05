import { z } from "zod";

/**
 * Types for AI-generated Bible commentary system
 */

// Strong's concordance data for individual words
export const StrongsWordSchema = z.object({
  word: z.string(), // Original Hebrew/Greek word
  transliteration: z.string(), // How to pronounce it
  strongsNumber: z.string(), // Strong's reference number (e.g., "H430", "G2316")
  definition: z.string(), // Primary definition
  usage: z.string(), // How it's typically used
  occurrences: z.number().optional(), // How many times it appears in Bible
});

export type StrongsWord = z.infer<typeof StrongsWordSchema>;

// Word analysis for verse commentary
export const WordAnalysisSchema = z.object({
  originalWord: z.string(), // Word in English
  strongs: StrongsWordSchema.optional(), // Strong's data if available
  grammar: z.string().optional(), // Grammatical notes (verb tense, etc.)
  significance: z.string().optional(), // Why this word matters in context
});

export type WordAnalysis = z.infer<typeof WordAnalysisSchema>;

// Chapter commentary from database
export const ChapterCommentarySchema = z.object({
  id: z.string(),
  book: z.string(),
  chapter: z.number(),
  context: z.string(), // Modern English explanation
  speaker: z.string().nullable(), // Who is speaking/writing
  topics: z.array(z.string()), // Main topics/themes
  culture: z.string().nullable(), // Ancient cultural context
  history: z.string().nullable(), // Historical background
  commentary: z.string(), // Independent Baptist commentary
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
  model: z.string(), // AI model used
  version: z.string(), // Commentary version
});

export type ChapterCommentary = z.infer<typeof ChapterCommentarySchema>;

// Verse commentary from database
export const VerseCommentarySchema = z.object({
  id: z.string(),
  book: z.string(),
  chapter: z.number(),
  verse: z.number(),
  context: z.string(), // Verse-specific context
  strongs: z.record(StrongsWordSchema), // Strong's concordance data as JSON
  words: z.record(z.any()), // Word meanings and analysis as JSON
  grammar: z.string().nullable(), // Grammatical analysis
  references: z.array(z.string()), // Cross-references
  commentary: z.string(), // Independent Baptist commentary
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
  model: z.string(), // AI model used
  version: z.string(), // Commentary version
});

export type VerseCommentary = z.infer<typeof VerseCommentarySchema>;

export const ChapterCommentaryAiSchema = z.object({
  context: z.string(),
  speaker: z.string(),
  topics: z.array(z.string()),
  culture: z.string(),
  history: z.string(),
  commentary: z.string(),
});

export const VerseCommentaryAiSchema = z.object({
  context: z.string(),
  strongs: z.record(z.any()),
  words: z.record(z.any()),
  grammar: z.string(),
  references: z.array(z.string()),
  commentary: z.string(),
});

const numberString = z.string().regex(/^\d+$/).transform(Number);

const numberOrNumberString = z.union([numberString, z.number()]);

// API request/response types
export const CommentaryRequestSchema = z.object({
  book: z.string(),
  chapter: numberOrNumberString,
  verse: numberOrNumberString.optional(),
});

export type CommentaryRequest = z.infer<typeof CommentaryRequestSchema>;

// Unified commentary response (could be chapter or verse)
export const CommentaryResponseSchema = z.object({
  type: z.enum(["chapter", "verse"]),
  book: z.string(),
  chapter: z.number(),
  verse: z.number().optional(),

  // Chapter-level data (always present)
  chapterContext: z.string(),
  speaker: z.string().nullable(),
  topics: z.array(z.string()),
  culture: z.string().nullable(),
  history: z.string().nullable(),
  chapterCommentary: z.string(),

  // Verse-level data (only for verse requests)
  verseContext: z.string().optional(),
  strongs: z.array(StrongsWordSchema).optional(),
  words: z.array(WordAnalysisSchema).optional(),
  grammar: z.string().optional(),
  references: z.array(z.string()).optional(),
  verseCommentary: z.string().optional(),

  // Metadata
  cached: z.boolean(), // Whether this was served from cache
  generatedAt: z.string(), // ISO date string
  model: z.string(), // AI model used
});

export type CommentaryResponse = z.infer<typeof CommentaryResponseSchema>;

// Loading states for UI
export type CommentaryLoadingState =
  | "idle"
  | "loading"
  | "generating" // First time generation (slower)
  | "success"
  | "error";

// Error types
export const CommentaryErrorSchema = z.object({
  code: z.enum([
    "INVALID_REFERENCE",
    "AI_SERVICE_ERROR",
    "DATABASE_ERROR",
    "RATE_LIMIT_EXCEEDED",
    "UNKNOWN_ERROR",
  ]),
  message: z.string(),
  reference: z.string().optional(), // The reference that caused the error
});

export type CommentaryError = z.infer<typeof CommentaryErrorSchema>;

// Commentary cache statistics (for admin/debugging)
export const CommentaryCacheStatsSchema = z.object({
  totalChapters: z.number(),
  cachedChapters: z.number(),
  totalVerses: z.number(),
  cachedVerses: z.number(),
  cacheHitRate: z.number(), // Percentage
  oldestEntry: z.string().optional(), // ISO date string
  newestEntry: z.string().optional(), // ISO date string
});

export type CommentaryCacheStats = z.infer<typeof CommentaryCacheStatsSchema>;
