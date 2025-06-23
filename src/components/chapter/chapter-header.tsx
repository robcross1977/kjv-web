"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Wrench } from "lucide-react";
import { ValidBookName } from "kingjames";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";
import { useTools } from "@/components/tools/tools-provider";

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
  const { openToolsSheet } = useTools();

  const formatBookName = (book: string) => {
    return book
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="mb-6">
      {/* Chapter title */}
      <h1 className="text-4xl font-bold text-foreground mb-4 pb-4 border-b">
        {formatBookName(book)} {chapter}
      </h1>

      {/* Action buttons - aligned with verse circles */}
      <div className="ml-2 mb-2 flex items-center gap-2">
        {/* Tools button - opens unified tools sheet */}
        <Button
          onClick={() => openToolsSheet("search")}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          title="Open Bible study tools (Press T for reading tools, / for search)"
        >
          <Wrench className="h-4 w-4" />
          <span className="hidden sm:inline">Tools</span>
        </Button>

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
