"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSearchType } from "@/lib/reference-parser";

/**
 * Direct search bar for AI spiritual search in the header
 * Navigates to main page to show results instead of dropdown
 */
export default function HeaderMastraSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setIsLoading(true);

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

      setQuery("");
      router.push(url);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search Bible or ask questions..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
