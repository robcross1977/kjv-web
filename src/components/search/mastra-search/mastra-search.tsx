"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";

interface MastraVerse {
  reference: string;
  relevance: number;
}

interface MastraResponse {
  verses: MastraVerse[];
  context: string;
  query: string;
}

function AiIcon() {
  return <Sparkles className="w-5 h-5 text-purple-500" />;
}

type Props = {
  setOpen: (open: boolean) => void;
};

/**
 * Mastra AI-powered spiritual search component
 * Allows users to ask spiritual questions and receive relevant Bible verses
 * Uses the Mastra agent to convert natural language to Bible references
 */
export default function MastraSearch({ setOpen }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MastraResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/bible-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmedQuery,
          limit: 8,
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: MastraResponse = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Mastra search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerseClick = (reference: string) => {
    // Convert reference to URL format and navigate
    const url = `/?query=${encodeURIComponent(reference)}`;
    setOpen(false);
    router.push(url);
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
    setQuery("");
  };

  if (results) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AiIcon />
            <span className="font-semibold text-lg">AI Search Results</span>
          </div>
          <Button variant="outline" size="sm" onClick={clearResults}>
            New Search
          </Button>
        </div>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-purple-600" />
              &ldquo;{results.query}&rdquo;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">{results.context}</p>
            <div className="space-y-2">
              {results.verses && results.verses.length > 0 ? (
                pipe(
                  results.verses,
                  A.map((verse) => (
                    <button
                      key={verse.reference}
                      onClick={() => handleVerseClick(verse.reference)}
                      className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:bg-purple-25 transition-all duration-200 text-left"
                    >
                      <span className="font-medium text-purple-700">
                        {verse.reference}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(verse.relevance * 100)}% match
                      </Badge>
                    </button>
                  ))
                )
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No verses found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 font-semibold text-lg mb-2">
          <AiIcon />
          AI Spiritual Search
        </div>
        <p className="text-sm text-gray-600">
          Ask questions about faith, life, or spiritual topics
        </p>
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder="Ex: How can I find comfort during difficult times? What does the Bible say about forgiveness? Verses about God's love..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[80px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSearch();
            }
          }}
        />

        <Button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Searching Scripture...
            </>
          ) : (
            <>
              <AiIcon />
              <span className="ml-2">Find Verses</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <p className="text-sm text-red-700">
              <strong>Search Error:</strong> {error}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Please try again or check your connection.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Example questions:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>&ldquo;How to overcome anxiety?&rdquo;</li>
          <li>&ldquo;What does God say about forgiveness?&rdquo;</li>
          <li>&ldquo;Verses about hope and strength&rdquo;</li>
          <li>&ldquo;Biblical wisdom for relationships&rdquo;</li>
        </ul>
      </div>
    </div>
  );
}
