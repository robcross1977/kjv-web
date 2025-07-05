import { useState, useCallback } from "react";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import type {
  CommentaryResponse,
  CommentaryLoadingState,
  CommentaryError,
} from "../types/commentary";

/**
 * React hook for managing Bible commentary state and API calls
 * Provides simplified interface for getting chapter and verse commentary
 */
export function useCommentary() {
  const [commentary, setCommentary] = useState<O.Option<CommentaryResponse>>(
    O.none
  );
  const [loadingState, setLoadingState] =
    useState<CommentaryLoadingState>("idle");
  const [error, setError] = useState<CommentaryError | null>(null);

  /**
   * Get commentary for a chapter or verse
   */
  const getCommentary = useCallback(
    async (book: string, chapter: number, verse?: number) => {
      setLoadingState("loading");
      setError(null);

      try {
        console.log(
          "Commentary hook: Requesting commentary for",
          book,
          chapter,
          verse
        );

        // Build API URL
        const params = new URLSearchParams({
          book: book.toLowerCase(),
          chapter: chapter.toString(),
        });

        if (verse !== undefined) {
          params.append("verse", verse.toString());
        }

        const response = await fetch(`/api/commentary?${params}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get commentary");
        }

        const data: CommentaryResponse = await response.json();

        console.log(
          "Commentary hook: Received commentary",
          data.cached ? "(cached)" : "(generated)"
        );

        setCommentary(O.some(data));
        setLoadingState(data.cached ? "success" : "generating");

        // If it was generated (not cached), show success after a brief delay
        if (!data.cached) {
          setTimeout(() => setLoadingState("success"), 1000);
        }
      } catch (err) {
        console.error("Commentary hook: Error getting commentary:", err);

        const commentaryError: CommentaryError = {
          code: "UNKNOWN_ERROR",
          message:
            err instanceof Error ? err.message : "Unknown error occurred",
          reference: verse
            ? `${book} ${chapter}:${verse}`
            : `${book} ${chapter}`,
        };

        setError(commentaryError);
        setLoadingState("error");
      }
    },
    []
  );

  /**
   * Check if commentary exists in cache without triggering generation
   * Returns true if cached, false if not cached, null if error
   */
  const checkCommentaryCache = useCallback(
    async (
      book: string,
      chapter: number,
      verse?: number
    ): Promise<boolean | null> => {
      try {
        const params = new URLSearchParams({
          book: book.toLowerCase(),
          chapter: chapter.toString(),
        });

        if (verse !== undefined) {
          params.append("verse", verse.toString());
        }

        const response = await fetch(`/api/commentary?${params}`);

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return data.cached === true;
      } catch (err) {
        console.error("Commentary cache check failed:", err);
        return null;
      }
    },
    []
  );

  /**
   * Clear current commentary
   */
  const clearCommentary = useCallback(() => {
    setCommentary(O.none);
    setLoadingState("idle");
    setError(null);
  }, []);

  /**
   * Get chapter commentary specifically
   */
  const getChapterCommentary = useCallback(
    (book: string, chapter: number) => {
      return getCommentary(book, chapter);
    },
    [getCommentary]
  );

  /**
   * Get verse commentary specifically
   */
  const getVerseCommentary = useCallback(
    (book: string, chapter: number, verse: number) => {
      return getCommentary(book, chapter, verse);
    },
    [getCommentary]
  );

  return {
    // State
    commentary,
    loadingState,
    error,

    // Computed state
    isLoading: loadingState === "loading" || loadingState === "generating",
    isGenerating: loadingState === "generating",
    hasCommentary: O.isSome(commentary),

    // Actions
    getCommentary,
    getChapterCommentary,
    getVerseCommentary,
    clearCommentary,
    checkCommentaryCache,

    // Utilities
    getCommentaryValue: () =>
      pipe(
        commentary,
        O.getOrElse(() => null as CommentaryResponse | null)
      ),
  };
}

/**
 * Type guard to check if commentary is for a verse
 */
export function isVerseCommentary(
  commentary: CommentaryResponse
): commentary is CommentaryResponse & { verse: number } {
  return commentary.type === "verse" && commentary.verse !== undefined;
}

/**
 * Type guard to check if commentary is for a chapter
 */
export function isChapterCommentary(
  commentary: CommentaryResponse
): commentary is CommentaryResponse & { verse: undefined } {
  return commentary.type === "chapter";
}

/**
 * Format commentary reference for display
 */
export function formatCommentaryReference(
  commentary: CommentaryResponse
): string {
  const bookName =
    commentary.book.charAt(0).toUpperCase() + commentary.book.slice(1);

  if (isVerseCommentary(commentary)) {
    return `${bookName} ${commentary.chapter}:${commentary.verse}`;
  } else {
    return `${bookName} ${commentary.chapter}`;
  }
}

/**
 * Get loading message based on state
 */
export function getLoadingMessage(
  loadingState: CommentaryLoadingState
): string {
  switch (loadingState) {
    case "loading":
      return "Checking commentary cache...";
    case "generating":
      return "Generating AI commentary (this may take a moment)...";
    case "success":
      return "";
    case "error":
      return "Failed to load commentary";
    case "idle":
    default:
      return "";
  }
}
