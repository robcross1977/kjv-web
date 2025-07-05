"use client";

import { useCompletion } from "ai/react";
import { useMemo, useState, useCallback } from "react";

export function useStreamingCommentary(
  book: string,
  chapter: number,
  verse?: number
) {
  const [hasStarted, setHasStarted] = useState(false);

  const id = useMemo(
    () => (verse ? `${book}-${chapter}-${verse}` : `${book}-${chapter}`),
    [book, chapter, verse]
  );

  const {
    completion,
    complete,
    error,
    isLoading: isGenerating,
  } = useCompletion({
    id,
    api: "/api/commentary",
    streamProtocol: "text",
    body: { book, chapter, verse },
  });

  // Function to explicitly start commentary generation
  const startCommentary = useCallback(async () => {
    if (hasStarted) return; // Prevent multiple calls

    setHasStarted(true);
    // Trigger generation - the server will handle cache checking
    complete("generate");
  }, [complete, hasStarted]);

  const commentaryText = completion;

  const commentaryData = useMemo(() => {
    try {
      return JSON.parse(commentaryText);
    } catch {
      return null;
    }
  }, [commentaryText]);

  const isCached = useMemo(() => {
    // If we have data and it parsed successfully, it's likely cached
    return commentaryData !== null && !isGenerating && hasStarted;
  }, [commentaryData, isGenerating, hasStarted]);

  const isLoading = isGenerating && !commentaryText;

  return {
    isLoading,
    isGenerating,
    isCached,
    error,
    commentaryText,
    commentaryData,
    hasStarted,
    startCommentary, // Expose function to manually start commentary
  };
}
