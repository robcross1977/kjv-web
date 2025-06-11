"use client";

import { useState, useCallback, useEffect } from "react";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import {
  VerseReference,
  ReadStatus,
  createVerseKey,
} from "@/types/read-status";

type ReadStatusMap = Record<string, ReadStatus>;

/**
 * Custom hook for managing read status with API integration
 * Uses fp-ts patterns for error handling and state management
 */
export function useReadStatus() {
  const [readStatusMap, setReadStatusMap] = useState<ReadStatusMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch read status for verses in a chapter
   */
  const fetchReadStatus = useCallback(
    async (book: string, chapter: number, verses: number[]) => {
      setIsLoading(true);
      setError(null);

      const result = await pipe(
        TE.tryCatch(
          () => {
            const params = new URLSearchParams({
              book,
              chapter: chapter.toString(),
              verses: verses.join(","),
            });

            return fetch(`/api/verses/read-status?${params}`);
          },
          (error) => `Network error: ${error}`
        ),
        TE.chain((response) =>
          response.ok
            ? TE.tryCatch(
                () => response.json(),
                (error) => `JSON parse error: ${error}`
              )
            : TE.left(`HTTP error: ${response.status}`)
        ),
        TE.map((data) => {
          // Convert read verses array to status map
          const statusMap: ReadStatusMap = {};

          // Initialize all verses as unread
          verses.forEach((verse) => {
            const key = createVerseKey(book, chapter, verse);
            statusMap[key] = "unread";
          });

          // Mark read verses
          if (data.readVerses && Array.isArray(data.readVerses)) {
            data.readVerses.forEach((readVerse: any) => {
              const key = createVerseKey(
                readVerse.book,
                readVerse.chapter,
                readVerse.verse
              );
              statusMap[key] = "read";
            });
          }

          return statusMap;
        })
      )();

      setIsLoading(false);

      if (result._tag === "Left") {
        setError(result.left);
        return;
      }

      setReadStatusMap((prev) => ({ ...prev, ...result.right }));
    },
    []
  );

  /**
   * Mark verses as read
   */
  const markVersesAsRead = useCallback(async (verses: VerseReference[]) => {
    setIsLoading(true);
    setError(null);

    const result = await pipe(
      TE.tryCatch(
        () =>
          fetch("/api/verses/mark-read", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ verses }),
          }),
        (error) => `Network error: ${error}`
      ),
      TE.chain((response) =>
        response.ok
          ? TE.tryCatch(
              () => response.json(),
              (error) => `JSON parse error: ${error}`
            )
          : TE.left(`HTTP error: ${response.status}`)
      )
    )();

    setIsLoading(false);

    if (result._tag === "Left") {
      setError(result.left);
      return false;
    }

    // Update local state
    const statusUpdates: ReadStatusMap = {};
    verses.forEach(({ book, chapter, verse }) => {
      const key = createVerseKey(book, chapter, verse);
      statusUpdates[key] = "read";
    });

    setReadStatusMap((prev) => ({ ...prev, ...statusUpdates }));
    return true;
  }, []);

  /**
   * Mark verses as unread
   */
  const markVersesAsUnread = useCallback(async (verses: VerseReference[]) => {
    setIsLoading(true);
    setError(null);

    const result = await pipe(
      TE.tryCatch(
        () =>
          fetch("/api/verses/mark-read", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ verses, action: "unmark" }),
          }),
        (error) => `Network error: ${error}`
      ),
      TE.chain((response) =>
        response.ok
          ? TE.tryCatch(
              () => response.json(),
              (error) => `JSON parse error: ${error}`
            )
          : TE.left(`HTTP error: ${response.status}`)
      )
    )();

    setIsLoading(false);

    if (result._tag === "Left") {
      setError(result.left);
      return false;
    }

    // Update local state
    const statusUpdates: ReadStatusMap = {};
    verses.forEach(({ book, chapter, verse }) => {
      const key = createVerseKey(book, chapter, verse);
      statusUpdates[key] = "unread";
    });

    setReadStatusMap((prev) => ({ ...prev, ...statusUpdates }));
    return true;
  }, []);

  /**
   * Get read status for a specific verse
   */
  const getVerseReadStatus = useCallback(
    (book: string, chapter: number, verse: number): ReadStatus => {
      const key = createVerseKey(book, chapter, verse);
      return readStatusMap[key] || "unread";
    },
    [readStatusMap]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    readStatusMap,
    isLoading,
    error,
    fetchReadStatus,
    markVersesAsRead,
    markVersesAsUnread,
    getVerseReadStatus,
    clearError,
  };
}
