"use client";

import * as E from "fp-ts/Either";
import { useState } from "react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useTools } from "@/components/tools/tools-provider";
import { BookmarkSearch } from "./bookmark-search";
import { BookmarksList } from "./bookmarks-list";
import { CreateBookmarkForm } from "./create-bookmark-form";
import { Button } from "@/components/ui/button";
import { Plus, Bookmark } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  currentContext?: {
    book?: string;
    chapter?: number;
    verses?: number[];
  };
};

/**
 * Main bookmarks section component for the tools sheet
 */
export function BookmarksSection({ currentContext }: Props) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { isLoggedIn } = useTools();
  const {
    bookmarks,
    loading,
    error,
    total,
    page,
    totalPages,
    searchParams,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    navigateToBookmark,
    updateSearch,
    goToPage,
    refresh,
  } = useBookmarks(undefined, isLoggedIn);

  const handleCreateBookmark = async (data: any) => {
    const result = await createBookmark(data);

    if (E.isRight(result)) {
      setShowCreateForm(false);
      return true;
    } else {
      return false;
    }
  };

  const handleQuickBookmark = () => {
    if (currentContext?.book && currentContext?.chapter) {
      const reference =
        currentContext.verses && currentContext.verses.length > 0
          ? `${currentContext.book} ${
              currentContext.chapter
            }:${currentContext.verses.join(",")}`
          : `${currentContext.book} ${currentContext.chapter}`;

      setShowCreateForm(true);
      // The form will pre-populate with this reference
    } else {
      setShowCreateForm(true);
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create New Bookmark</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </Button>
        </div>
        <CreateBookmarkForm
          onSubmit={handleCreateBookmark}
          onCancel={() => setShowCreateForm(false)}
          initialReference={
            currentContext?.book && currentContext?.chapter
              ? currentContext.verses && currentContext.verses.length > 0
                ? `${currentContext.book} ${
                    currentContext.chapter
                  }:${currentContext.verses.join(",")}`
                : `${currentContext.book} ${currentContext.chapter}`
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white text-gray-900">
      {/* Search and Controls */}
      <div className="space-y-3">
        <BookmarkSearch searchParams={searchParams} onSearch={updateSearch} />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {total > 0
              ? `${total} bookmark${total === 1 ? "" : "s"} found`
              : "No bookmarks yet"}
          </div>

          <div className="flex gap-2">
            {currentContext?.book && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickBookmark}
                className="flex items-center gap-2"
              >
                <Bookmark className="h-4 w-4" />
                Quick Bookmark
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Bookmark
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Bookmarks List */}
      <BookmarksList
        bookmarks={bookmarks}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onUpdate={updateBookmark}
        onDelete={deleteBookmark}
        onNavigate={navigateToBookmark}
        onPageChange={goToPage}
        onRefresh={refresh}
      />
    </div>
  );
}
