"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Sparkles, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

/**
 * Direct search bar for AI spiritual search in the header
 * Shows results in a popover dropdown below the search bar
 */
export default function HeaderMastraSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MastraResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setIsLoading(true);
    setError(null);
    setResults(null);
    setIsOpen(true);

    try {
      const response = await fetch("/api/bible-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmedQuery,
          limit: 6,
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
    const url = `/?query=${encodeURIComponent(reference)}`;
    setIsOpen(false);
    setQuery("");
    setResults(null);
    setError(null);
    router.push(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Clear results when user starts typing a new query
    if (results) {
      setResults(null);
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
            <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
            <Input
              placeholder="Ask about faith, love, hope..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query && !results && !isLoading && setIsOpen(true)}
              className="pl-10 pr-10 bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-200 placeholder:text-purple-400"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[400px] p-0 bg-white border-purple-200"
          align="start"
          side="bottom"
          sideOffset={8}
        >
          {isLoading && (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600 mr-2" />
              <span className="text-sm text-purple-600">
                Searching Scripture...
              </span>
            </div>
          )}

          {error && (
            <div className="p-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {results && (
            <div className="max-h-80 overflow-y-auto">
              <div className="p-4 border-b bg-purple-50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    Results for &ldquo;{results.query}&rdquo;
                  </span>
                </div>
                <p className="text-xs text-purple-600">{results.context}</p>
              </div>

              <div className="p-2">
                {results.verses && results.verses.length > 0 ? (
                  pipe(
                    results.verses,
                    A.map((verse) => (
                      <button
                        key={verse.reference}
                        onClick={() => handleVerseClick(verse.reference)}
                        className="flex items-center justify-between w-full p-3 rounded hover:bg-purple-50 transition-all duration-200 text-left border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-purple-700 text-sm">
                          {verse.reference}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs bg-purple-100 text-purple-700 border-purple-200"
                        >
                          {Math.round(verse.relevance * 100)}%
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
            </div>
          )}

          {!isLoading && !results && !error && query && (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 mb-2">
                Press Enter to search
              </p>
              <p className="text-xs text-gray-400">
                Try: &ldquo;comfort&rdquo;, &ldquo;forgiveness&rdquo;,
                &ldquo;hope&rdquo;
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
