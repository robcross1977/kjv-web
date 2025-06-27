"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ValidBookName } from "kingjames";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";

type Props = {
  book: ValidBookName;
  chapter: number;
  isToolsActive: boolean;
  onMarkAllAsRead: () => void;
};

/**
 * Chapter header component with optional "Mark All as Read" button
 * Shows the chapter title and tools when active
 */
export function ChapterHeader({
  book,
  chapter,
  isToolsActive,
  onMarkAllAsRead,
}: Props) {
  return (
    <div className="mb-6">
      {/* Chapter title */}
      <h1 className="text-4xl font-bold text-foreground mb-4 pb-4 border-b leading-tight py-2">
        Chapter {chapter}
      </h1>

      {/* Action buttons - aligned with verse circles */}
      <div className="ml-2 mb-2 flex items-center gap-2">
        {/* Bookmark button - authentication-aware */}
        <BookmarkButton
          book={book}
          chapter={chapter}
          variant="outline"
          size="sm"
        />

        {/* Mark all as read button - only when tools active */}
        {isToolsActive && (
          <Button
            onClick={onMarkAllAsRead}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>
    </div>
  );
}
