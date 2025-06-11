"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ValidBookName } from "kingjames";

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

      {/* Mark all as read button - aligned with verse circles */}
      {isToolsActive && (
        <div className="ml-2 mb-2">
          <Button
            onClick={onMarkAllAsRead}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark All as Read
          </Button>
        </div>
      )}
    </div>
  );
}
