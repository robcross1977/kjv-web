"use client";

import * as E from "fp-ts/Either";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bookmark, BookmarkPlus } from "lucide-react";
import { CreateBookmarkForm } from "./create-bookmark-form";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useTools } from "@/components/tools/tools-provider";
import { type CreateBookmarkRequest } from "@/types/bookmark";

type Props = {
  book: string;
  chapter: number;
  verses?: number[];
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  showText?: boolean;
};

/**
 * Bookmark button component for adding current passage to bookmarks
 */
export function BookmarkButton({
  book,
  chapter,
  verses,
  variant = "outline",
  size = "sm",
  className = "",
  showText = true,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLoggedIn } = useTools();
  const { createBookmark } = useBookmarks(undefined, isLoggedIn);

  const reference =
    verses && verses.length > 0
      ? `${book} ${chapter}:${verses.join(",")}`
      : `${book} ${chapter}`;

  const handleCreateBookmark = async (
    data: CreateBookmarkRequest
  ): Promise<boolean> => {
    const result = await createBookmark(data);

    if (E.isRight(result)) {
      setIsDialogOpen(false);
      return true;
    } else {
      return false;
    }
  };

  // Don't render bookmark button if user is not authenticated
  if (!isLoggedIn) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center gap-2 ${className}`}
        >
          <BookmarkPlus className="h-4 w-4" />
          {showText && <span className="hidden sm:inline">Bookmark</span>}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Create Bookmark
          </DialogTitle>
          <DialogDescription>
            Save this passage to your bookmarks for quick access later.
          </DialogDescription>
        </DialogHeader>

        <CreateBookmarkForm
          onSubmit={handleCreateBookmark}
          onCancel={() => setIsDialogOpen(false)}
          initialReference={reference}
        />
      </DialogContent>
    </Dialog>
  );
}
