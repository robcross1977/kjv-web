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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bookmark, BookmarkPlus, ChevronDown, Zap } from "lucide-react";
import { CreateBookmarkForm } from "./create-bookmark-form";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useBookmarkFolders } from "@/hooks/use-bookmark-folders";
import { useTools } from "@/components/tools/tools-provider";
import { useToast } from "@/hooks/use-toast";
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
 * Supports both quick bookmarking and full bookmark dialog
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
  const { folders, createFolder } = useBookmarkFolders(isLoggedIn);
  const { toast } = useToast();

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

  /**
   * Create a quick bookmark with minimal user interaction
   */
  const handleQuickBookmark = async () => {
    try {
      // Find or create "Quick Bookmarks" folder
      let quickBookmarksFolder = folders.find(
        (f) => f.name === "Quick Bookmarks"
      );

      if (!quickBookmarksFolder) {
        const folderResult = await createFolder({
          name: "Quick Bookmarks",
          description: "Automatically created bookmarks for quick access",
          color: "#10b981", // Green color
        });

        if (E.isLeft(folderResult)) {
          toast({
            title: "Error",
            description: "Failed to create Quick Bookmarks folder",
            variant: "destructive",
          });
          return;
        }

        quickBookmarksFolder = folderResult.right;
      }

      // Create the bookmark
      const bookmarkData: CreateBookmarkRequest = {
        name: reference, // Use the reference as the title
        reference: reference,
        folderId: quickBookmarksFolder.id,
        tags: [], // No tags for quick bookmarks
        // No description for quick bookmarks
      };

      const result = await createBookmark(bookmarkData);

      if (E.isRight(result)) {
        toast({
          title: "Quick Bookmark Created",
          description: `${reference} added to Quick Bookmarks`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create bookmark",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quick bookmark",
        variant: "destructive",
      });
    }
  };

  // Don't render bookmark button if user is not authenticated
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center">
      {/* Quick Bookmark Button */}
      <Button
        variant={variant}
        size={size}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 rounded-r-none border-r-0 ${className}`}
        onClick={handleQuickBookmark}
      >
        <Zap className="h-4 w-4" />
        {showText && <span className="text-xs sm:text-sm">Quick</span>}
      </Button>

      {/* Dropdown for Full Bookmark */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className="rounded-l-none px-2">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Create Full Bookmark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Full Bookmark Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Create Bookmark
            </DialogTitle>
            <DialogDescription>
              Save this passage to your bookmarks with custom details.
            </DialogDescription>
          </DialogHeader>

          <CreateBookmarkForm
            onSubmit={handleCreateBookmark}
            onCancel={() => setIsDialogOpen(false)}
            initialReference={reference}
            folders={folders}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
