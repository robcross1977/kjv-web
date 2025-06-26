"use client";

import { useState, useEffect } from "react";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { WrappedRecords, ValidBookName } from "kingjames";
import { parseReference } from "@/lib/reference-parser";
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
    pipe(
      parseReference(verse.reference),
      E.fold(
        () => {}, // Skip verses that can't be parsed
        (parsed) => {
          const book = parsed.book.toLowerCase();
          const chapter = parsed.startChapter;
          const verseNum = parsed.startVerse || 1;

          if (!records[book]) records[book] = {};
          if (!records[book][chapter]) records[book][chapter] = {};
          records[book][chapter][verseNum] = verse.text;
        }
      )
    );
  });

  return {
    type: "ai_search",
    records,
  };
}

/**
 * Client-side AI search component that fetches results and displays them
 */
export default function AiSearchClient({
  aiQuery,
  book,
  chapter,
  verse,
  query,
}: Props) {
  const [results, setResults] = useState<WrappedRecords>({
    type: "none",
    records: {},
  });
  const [context, setContext] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAiResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/bible-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: aiQuery, limit: 20 }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch AI search results");
        }

        const data = await response.json();
        const wrappedResults = convertAiResultsToWrappedRecords(
          data.verses || []
        );

        setResults(wrappedResults);
        setContext(data.context || "");
      } catch (err) {
        console.error("Error fetching AI search results:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setResults({ type: "none", records: {} });
        setContext("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiResults();
  }, [aiQuery]);

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
              <p className="text-muted-foreground text-sm">{error}</p>
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
      aiContext={context}
    />
  );
}
