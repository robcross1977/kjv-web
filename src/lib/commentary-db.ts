import prisma from "./prisma";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import type {
  ChapterCommentary,
  VerseCommentary,
  CommentaryError,
  StrongsWord,
  WordAnalysis,
} from "../types/commentary";

/**
 * Database operations for commentary caching
 * Uses fp-ts patterns for error handling and data flow
 */

const CURRENT_VERSION = "1.0";
const DEFAULT_MODEL = "gpt-4";

/**
 * Normalize book name for database storage
 */
const normalizeBookName = (book: string): string =>
  book
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "");

/**
 * Get chapter commentary from database cache
 */
export const getChapterCommentary = (
  book: string,
  chapter: number
): TE.TaskEither<CommentaryError, O.Option<ChapterCommentary>> =>
  pipe(
    TE.tryCatch(
      async () => {
        const normalizedBook = normalizeBookName(book);
        console.log(
          "Commentary DB: Looking for chapter commentary:",
          normalizedBook,
          chapter
        );

        const result = await prisma.chapterCommentary.findUnique({
          where: {
            book_chapter_version: {
              book: normalizedBook,
              chapter,
              version: CURRENT_VERSION,
            },
          },
        });

        if (!result) {
          console.log("Commentary DB: No chapter commentary found in cache");
          return null;
        }

        console.log("Commentary DB: Found cached chapter commentary");
        return {
          id: result.id,
          book: result.book,
          chapter: result.chapter,
          context: result.context,
          speaker: result.speaker,
          topics: result.topics,
          culture: result.culture,
          history: result.history,
          commentary: result.commentary,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
          model: result.model,
          version: result.version,
        } as ChapterCommentary;
      },
      (error): CommentaryError => ({
        code: "DATABASE_ERROR",
        message: `Failed to get chapter commentary: ${error}`,
        reference: `${book} ${chapter}`,
      })
    ),
    TE.map(O.fromNullable)
  );

/**
 * Save chapter commentary to database cache
 */
export const saveChapterCommentary = (
  book: string,
  chapter: number,
  context: string,
  speaker: string | null,
  topics: string[],
  culture: string | null,
  history: string | null,
  commentary: string,
  model: string = DEFAULT_MODEL
): TE.TaskEither<CommentaryError, ChapterCommentary> =>
  pipe(
    TE.tryCatch(
      async () => {
        const normalizedBook = normalizeBookName(book);
        console.log(
          "Commentary DB: Saving chapter commentary:",
          normalizedBook,
          chapter
        );

        const result = await prisma.chapterCommentary.upsert({
          where: {
            book_chapter_version: {
              book: normalizedBook,
              chapter,
              version: CURRENT_VERSION,
            },
          },
          update: {
            context,
            speaker,
            topics,
            culture,
            history,
            commentary,
            model,
            updatedAt: new Date(),
          },
          create: {
            book: normalizedBook,
            chapter,
            context,
            speaker,
            topics,
            culture,
            history,
            commentary,
            model,
            version: CURRENT_VERSION,
          },
        });

        console.log(
          "Commentary DB: Saved chapter commentary with ID:",
          result.id
        );
        return {
          id: result.id,
          book: result.book,
          chapter: result.chapter,
          context: result.context,
          speaker: result.speaker,
          topics: result.topics,
          culture: result.culture,
          history: result.history,
          commentary: result.commentary,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
          model: result.model,
          version: result.version,
        } as ChapterCommentary;
      },
      (error): CommentaryError => ({
        code: "DATABASE_ERROR",
        message: `Failed to save chapter commentary: ${error}`,
        reference: `${book} ${chapter}`,
      })
    )
  );

/**
 * Get verse commentary from database cache
 */
export const getVerseCommentary = (
  book: string,
  chapter: number,
  verse: number
): TE.TaskEither<CommentaryError, O.Option<VerseCommentary>> =>
  pipe(
    TE.tryCatch(
      async () => {
        const normalizedBook = normalizeBookName(book);
        console.log(
          "Commentary DB: Looking for verse commentary:",
          normalizedBook,
          chapter,
          verse
        );

        const result = await prisma.verseCommentary.findUnique({
          where: {
            book_chapter_verse_version: {
              book: normalizedBook,
              chapter,
              verse,
              version: CURRENT_VERSION,
            },
          },
        });

        if (!result) {
          console.log("Commentary DB: No verse commentary found in cache");
          return null;
        }

        console.log("Commentary DB: Found cached verse commentary");
        return {
          id: result.id,
          book: result.book,
          chapter: result.chapter,
          verse: result.verse,
          context: result.context,
          strongs: result.strongs as Record<string, any>,
          words: result.words as Record<string, any>,
          grammar: result.grammar,
          references: result.references,
          commentary: result.commentary,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
          model: result.model,
          version: result.version,
        } as VerseCommentary;
      },
      (error): CommentaryError => ({
        code: "DATABASE_ERROR",
        message: `Failed to get verse commentary: ${error}`,
        reference: `${book} ${chapter}:${verse}`,
      })
    ),
    TE.map(O.fromNullable)
  );

/**
 * Save verse commentary to database cache
 */
export const saveVerseCommentary = (
  book: string,
  chapter: number,
  verse: number,
  context: string,
  strongs: Record<string, any>,
  words: Record<string, any>,
  grammar: string | null,
  references: string[],
  commentary: string,
  model: string = DEFAULT_MODEL
): TE.TaskEither<CommentaryError, VerseCommentary> =>
  pipe(
    TE.tryCatch(
      async () => {
        const normalizedBook = normalizeBookName(book);
        console.log(
          "Commentary DB: Saving verse commentary:",
          normalizedBook,
          chapter,
          verse
        );

        // Data is already in object format, no need to convert
        const strongsJson = strongs;
        const wordsJson = words;

        const result = await prisma.verseCommentary.upsert({
          where: {
            book_chapter_verse_version: {
              book: normalizedBook,
              chapter,
              verse,
              version: CURRENT_VERSION,
            },
          },
          update: {
            context,
            strongs: strongsJson,
            words: wordsJson,
            grammar,
            references,
            commentary,
            model,
            updatedAt: new Date(),
          },
          create: {
            book: normalizedBook,
            chapter,
            verse,
            context,
            strongs: strongsJson,
            words: wordsJson,
            grammar,
            references,
            commentary,
            model,
            version: CURRENT_VERSION,
          },
        });

        console.log(
          "Commentary DB: Saved verse commentary with ID:",
          result.id
        );
        return {
          id: result.id,
          book: result.book,
          chapter: result.chapter,
          verse: result.verse,
          context: result.context,
          strongs: result.strongs as Record<string, any>,
          words: result.words as Record<string, any>,
          grammar: result.grammar,
          references: result.references,
          commentary: result.commentary,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
          model: result.model,
          version: result.version,
        } as VerseCommentary;
      },
      (error): CommentaryError => ({
        code: "DATABASE_ERROR",
        message: `Failed to save verse commentary: ${error}`,
        reference: `${book} ${chapter}:${verse}`,
      })
    )
  );

/**
 * Get commentary cache statistics
 */
export const getCommentaryCacheStats = (): TE.TaskEither<
  CommentaryError,
  {
    totalChapters: number;
    cachedChapters: number;
    totalVerses: number;
    cachedVerses: number;
    cacheHitRate: number;
    oldestEntry?: string;
    newestEntry?: string;
  }
> =>
  pipe(
    TE.tryCatch(
      async () => {
        console.log("Commentary DB: Getting cache statistics");

        const [chapterCount, verseCount, oldestChapter, newestChapter] =
          await Promise.all([
            prisma.chapterCommentary.count(),
            prisma.verseCommentary.count(),
            prisma.chapterCommentary.findFirst({
              orderBy: { createdAt: "asc" },
              select: { createdAt: true },
            }),
            prisma.chapterCommentary.findFirst({
              orderBy: { createdAt: "desc" },
              select: { createdAt: true },
            }),
          ]);

        // Rough estimates - in production would be more accurate
        const totalBibleChapters = 1189; // Total chapters in KJV
        const totalBibleVerses = 31102; // Total verses in KJV

        const cacheHitRate =
          totalBibleChapters > 0
            ? Math.round((chapterCount / totalBibleChapters) * 100)
            : 0;

        return {
          totalChapters: totalBibleChapters,
          cachedChapters: chapterCount,
          totalVerses: totalBibleVerses,
          cachedVerses: verseCount,
          cacheHitRate,
          oldestEntry: oldestChapter?.createdAt.toISOString(),
          newestEntry: newestChapter?.createdAt.toISOString(),
        };
      },
      (error): CommentaryError => ({
        code: "DATABASE_ERROR",
        message: `Failed to get cache statistics: ${error}`,
      })
    )
  );

/**
 * Clear commentary cache (admin function)
 */
export const clearCommentaryCache = (
  olderThan?: Date
): TE.TaskEither<
  CommentaryError,
  { deletedChapters: number; deletedVerses: number }
> =>
  pipe(
    TE.tryCatch(
      async () => {
        console.log(
          "Commentary DB: Clearing cache",
          olderThan ? `older than ${olderThan}` : "all"
        );

        const whereClause = olderThan ? { createdAt: { lt: olderThan } } : {};

        const [deletedChapters, deletedVerses] = await Promise.all([
          prisma.chapterCommentary.deleteMany({ where: whereClause }),
          prisma.verseCommentary.deleteMany({ where: whereClause }),
        ]);

        return {
          deletedChapters: deletedChapters.count,
          deletedVerses: deletedVerses.count,
        };
      },
      (error): CommentaryError => ({
        code: "DATABASE_ERROR",
        message: `Failed to clear cache: ${error}`,
      })
    )
  );
