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
      console.log("📖 FETCHING READ STATUS:", { book, chapter, verses });
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

      console.log("📖 FETCH SUCCESS - SETTING STATUS MAP:", result.right);
      setReadStatusMap((prev) => ({ ...prev, ...result.right }));
    },
    []
  );

  /**
   * Mark verses as read with optimistic updates
   */
  const markVersesAsRead = useCallback(
    async (verses: VerseReference[]) => {
      console.log("🔄 MARKING VERSES AS READ:", verses);
      setError(null);

      // Optimistic update - immediately mark as read
      const statusUpdates: ReadStatusMap = {};
      verses.forEach(({ book, chapter, verse }) => {
        const key = createVerseKey(book, chapter, verse);
        statusUpdates[key] = "read";
      });

      const previousState = readStatusMap;
      setReadStatusMap((prev) => ({ ...prev, ...statusUpdates }));

      // Make API call
      console.log("📡 MAKING API CALL to /api/verses/mark-read with:", {
        verses,
      });
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
          (error) => {
            console.error("📡 NETWORK ERROR:", error);
            return `Network error: ${error}`;
          }
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

      console.log("📡 API CALL COMPLETED. Result:", result);

      if (result._tag === "Left") {
        // Revert optimistic update on error
        console.error("❌ MARK AS READ FAILED:", result.left);
        setReadStatusMap(previousState);
        setError(result.left);
        return false;
      }

      console.log("✅ MARK AS READ SUCCESS");
      return true;
    },
    [readStatusMap]
  );

  /**
   * Mark verses as unread with optimistic updates
   */
  const markVersesAsUnread = useCallback(
    async (verses: VerseReference[]) => {
      setError(null);

      // Optimistic update - immediately mark as unread
      const statusUpdates: ReadStatusMap = {};
      verses.forEach(({ book, chapter, verse }) => {
        const key = createVerseKey(book, chapter, verse);
        statusUpdates[key] = "unread";
      });

      const previousState = readStatusMap;
      setReadStatusMap((prev) => ({ ...prev, ...statusUpdates }));

      // Make API call
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

      if (result._tag === "Left") {
        // Revert optimistic update on error
        setReadStatusMap(previousState);
        setError(result.left);
        return false;
      }

      return true;
    },
    [readStatusMap]
  );

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
