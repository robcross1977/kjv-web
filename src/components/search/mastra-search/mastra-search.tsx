"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import { getSearchType } from "@/lib/reference-parser";

interface MastraVerse {
  reference: string;
  text: string;
  relevance: number;
}

interface MastraResponse {
  verses: MastraVerse[];
  context: string;
  query: string;
}

function AiIcon() {
  return <Search className="w-5 h-5 text-muted-foreground" />;
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
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setIsLoading(true);
    setError(null);

    try {
      // Smart routing: detect if it's a Bible reference or free-form question
      const searchType = getSearchType(trimmedQuery);

      let url: string;
      if (searchType === "reference") {
        // Direct Bible reference search
        url = `/?query=${encodeURIComponent(trimmedQuery)}`;
      } else {
        // AI-powered spiritual search
        url = `/?ai_query=${encodeURIComponent(trimmedQuery)}`;
      }

      setOpen(false);
      router.push(url);
    } catch (err) {
      console.error("Search error:", err);
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

  const clearSearch = () => {
    setError(null);
    setQuery("");
  };

  // Results are now shown in main content area, so this component only shows the search form

  return (
    <div className="space-y-4">
      <div className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 font-semibold text-lg mb-2">
          <AiIcon />
          Spiritual Search
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
          className="w-full"
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
