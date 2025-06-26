"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { WrappedRecords, ValidBookName, search } from "kingjames";
import Search from "@/components/search";

type Props = {
  aiQuery: string;
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
  query?: string;
};

/**
 * Convert AI search results to WrappedRecords format
 */
function convertAiResultsToWrappedRecords(
  verses: Array<{ reference: string; text: string; relevance: number }>
): WrappedRecords {
  const records: any = {};

  verses.forEach((verse) => {
    // Use kingjames search to parse each reference
    const searchResult = search(verse.reference);

    // If kingjames can parse it, merge the results
    if (
      searchResult.type !== "none" &&
      Object.keys(searchResult.records).length > 0
    ) {
      // Copy the structure from kingjames but replace with AI verse text
      Object.entries(searchResult.records).forEach(([book, chapters]) => {
        Object.entries(chapters).forEach(([chapter, versesInChapter]) => {
          Object.keys(versesInChapter).forEach((verseNum) => {
            if (!records[book]) records[book] = {};
            if (!records[book][chapter]) records[book][chapter] = {};
            records[book][chapter][verseNum] = verse.text;
          });
        });
      });
    }
  });

  return {
    type: "ai_search",
    records,
  };
}

/**
 * SWR fetcher for AI search results
 */
const fetcher = async (
  url: string
): Promise<{ verses: any[]; context: string; query: string }> => {
  const [, queryParam] = url.split("?query=");
  const query = decodeURIComponent(queryParam);

  const response = await fetch("/api/bible-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit: 20 }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI search results");
  }

  return response.json();
};

/**
 * Client-side AI search component that fetches results and displays them
 * Uses SWR for caching to avoid duplicate AI token usage
 */
export default function AiSearchClient({
  aiQuery,
  book,
  chapter,
  verse,
  query,
}: Props) {
  // Create cache key for SWR
  const swrKey = `ai-search?query=${encodeURIComponent(aiQuery)}`;

  // Use SWR for cached fetching
  const { data, error, isLoading } = useSWR(swrKey, fetcher, {
    // Cache for 1 hour to avoid repeated AI calls for same queries
    dedupingInterval: 60 * 60 * 1000,
    // Keep data fresh for 30 minutes
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Memoize the conversion to WrappedRecords format
  const results = useMemo((): WrappedRecords => {
    if (!data?.verses) {
      return { type: "none", records: {} };
    }
    return convertAiResultsToWrappedRecords(data.verses);
  }, [data?.verses]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full mx-auto h-screen">
        <div className="flex flex-grow w-full pt-2">
          <div className="w-11/12 lg:w-2/3 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Searching Scripture...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full mx-auto h-screen">
        <div className="flex flex-grow w-full pt-2">
          <div className="w-11/12 lg:w-2/3 mx-auto flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive mb-2">Search Error</p>
              <p className="text-muted-foreground text-sm">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Search
      book={book}
      chapter={chapter}
      verse={verse}
      query={aiQuery}
      results={results}
      aiContext={data?.context || ""}
    />
  );
}
