"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import {
  type BookmarkSearchParams,
  BOOKMARK_CATEGORIES,
} from "@/types/bookmark";
import { bookOptions } from "@/components/search/select-search/types";

type Props = {
  searchParams: BookmarkSearchParams;
  onSearch: (params: Partial<BookmarkSearchParams>) => void;
};

/**
 * Search and filter component for bookmarks
 */
export function BookmarkSearch({ searchParams, onSearch }: Props) {
  const [query, setQuery] = useState(searchParams.query || "");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({ query: query.trim() || undefined });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleBookFilter = (book: string) => {
    onSearch({ book: book === "all" ? undefined : book });
  };

  const handleCategoryFilter = (category: string) => {
    onSearch({ category: category === "all" ? undefined : category });
  };

  const handleSortChange = (sortBy: string) => {
    onSearch({ sortBy: sortBy as any });
  };

  const handleSortOrderChange = (sortOrder: string) => {
    onSearch({ sortOrder: sortOrder as "asc" | "desc" });
  };

  const clearFilters = () => {
    setQuery("");
    onSearch({
      query: undefined,
      book: undefined,
      category: undefined,
      tags: undefined,
    });
  };

  const hasActiveFilters = !!(
    searchParams.query ||
    searchParams.book ||
    searchParams.category ||
    (searchParams.tags && searchParams.tags.length > 0)
  );

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks by name, reference, or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} size="sm">
          Search
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {searchParams.query && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Query: {searchParams.query}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSearch({ query: undefined })}
              />
            </Badge>
          )}

          {searchParams.book && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Book: {searchParams.book}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSearch({ book: undefined })}
              />
            </Badge>
          )}

          {searchParams.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {searchParams.category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSearch({ category: undefined })}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Book Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Book</label>
              <Select
                value={searchParams.book || "all"}
                onValueChange={handleBookFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All books" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All books</SelectItem>
                  {bookOptions.map((book) => (
                    <SelectItem key={book.key} value={book.value}>
                      {book.value.charAt(0).toUpperCase() + book.value.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={searchParams.category || "all"}
                onValueChange={handleCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {BOOKMARK_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <Select
                value={searchParams.sortBy}
                onValueChange={handleSortChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date created</SelectItem>
                  <SelectItem value="updatedAt">Date updated</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="accessCount">Most used</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <Select
                value={searchParams.sortOrder}
                onValueChange={handleSortOrderChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest first</SelectItem>
                  <SelectItem value="asc">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
