"use client";

import * as E from "fp-ts/Either";
import { useState } from "react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useBookmarkFolders } from "@/hooks/use-bookmark-folders";
import { useTools } from "@/components/tools/tools-provider";
import { BookmarkSearch } from "./bookmark-search";
import { FolderBrowser } from "./folder-browser";
import { CreateBookmarkForm } from "./create-bookmark-form";
import { CreateFolderForm } from "./create-folder-form";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
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
    moveToFolder,
    updateSearch,
    goToPage,
    refresh,
  } = useBookmarks(undefined, isLoggedIn);

  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
    createFolder,
    folderTree,
  } = useBookmarkFolders(isLoggedIn);

  const handleCreateBookmark = async (data: any) => {
    const result = await createBookmark(data);

    if (E.isRight(result)) {
      setShowCreateForm(false);
      return true;
    } else {
      return false;
    }
  };

  const handleCreateFolder = async (data: any) => {
    const result = await createFolder(data);
    if (E.isRight(result)) {
      setShowCreateFolderDialog(false);
      return true;
    }
    return false;
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
          folders={folders}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateFolderDialog(true)}
              className="flex items-center gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              New Folder
            </Button>
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

      {/* Folders Error Display */}
      {foldersError && (
        <Alert variant="destructive">
          <AlertDescription>Folders: {foldersError}</AlertDescription>
        </Alert>
      )}

      {/* Folder Browser */}
      <FolderBrowser
        bookmarks={bookmarks}
        folders={folders}
        folderTree={folderTree}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onUpdate={updateBookmark}
        onDelete={deleteBookmark}
        onNavigate={navigateToBookmark}
        onPageChange={goToPage}
        onRefresh={refresh}
        onMoveToFolder={moveToFolder}
      />

      {/* Create Folder Dialog */}
      <Dialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" />
              Create New Folder
            </DialogTitle>
            <DialogDescription>
              Create a new folder to organize your bookmarks.
            </DialogDescription>
          </DialogHeader>

          <CreateFolderForm
            onSubmit={handleCreateFolder}
            onCancel={() => setShowCreateFolderDialog(false)}
            folders={folders}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
