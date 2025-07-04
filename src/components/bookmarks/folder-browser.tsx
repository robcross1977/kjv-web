"use client";

import * as E from "fp-ts/Either";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder, FolderOpen, ChevronRight, Home, BookOpen } from "lucide-react";
import { type Bookmark, type UpdateBookmarkRequest } from "@/types/bookmark";
import {
  type BookmarkFolder,
  type FolderTreeNode,
} from "@/types/bookmark-folder";
import { DraggableBookmarksList } from "./draggable-bookmarks-list";

type Props = {
  bookmarks: Bookmark[];
  folders: BookmarkFolder[];
  folderTree: FolderTreeNode[];
  loading: boolean;
  page: number;
  totalPages: number;
  onUpdate: (
    id: string,
    data: UpdateBookmarkRequest
  ) => Promise<E.Either<string, Bookmark>>;
  onDelete: (id: string) => Promise<E.Either<string, boolean>>;
  onNavigate: (id: string) => Promise<E.Either<string, Bookmark>>;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onMoveToFolder: (
    bookmarkId: string,
    folderId: string | null
  ) => Promise<boolean>;
};

/**
 * Folder card component for browsing into folders
 */
function FolderCard({
  folder,
  bookmarkCount,
  onClick,
}: {
  folder: BookmarkFolder;
  bookmarkCount: number;
  onClick: () => void;
}) {
  return (
    <Card
      className="hover:shadow-md transition-shadow bg-white cursor-pointer border-dashed border-2 hover:border-blue-300"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Folder
              className="h-6 w-6"
              style={{ color: folder.color || "#6b7280" }}
            />
            <div>
              <h4 className="font-semibold text-sm">{folder.name}</h4>
              {folder.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {folder.description}
                </p>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {bookmarkCount} bookmark{bookmarkCount === 1 ? "" : "s"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Breadcrumb navigation component
 */
function FolderBreadcrumb({
  currentFolder,
  folders,
  onNavigateToRoot,
  onNavigateToFolder,
}: {
  currentFolder: BookmarkFolder | null;
  folders: BookmarkFolder[];
  onNavigateToRoot: () => void;
  onNavigateToFolder: (folderId: string) => void;
}) {
  // Build breadcrumb path
  const buildPath = (folder: BookmarkFolder): BookmarkFolder[] => {
    const path: BookmarkFolder[] = [folder];
    let current = folder;

    while (current.parentId) {
      const parent = folders.find((f) => f.id === current.parentId);
      if (parent) {
        path.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }

    return path;
  };

  const breadcrumbPath = currentFolder ? buildPath(currentFolder) : [];

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onNavigateToRoot}
        className="h-8 px-2 text-muted-foreground hover:text-foreground"
      >
        <Home className="h-4 w-4 mr-1" />
        All Bookmarks
      </Button>

      {breadcrumbPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center gap-2">
          <ChevronRight className="h-3 w-3" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateToFolder(folder.id)}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            disabled={index === breadcrumbPath.length - 1} // Disable current folder
          >
            <Folder
              className="h-3 w-3 mr-1"
              style={{ color: folder.color || "#6b7280" }}
            />
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
}

/**
 * Main folder browser component with hierarchical navigation
 */
export function FolderBrowser({
  bookmarks,
  folders,
  folderTree,
  loading,
  page,
  totalPages,
  onUpdate,
  onDelete,
  onNavigate,
  onPageChange,
  onRefresh,
  onMoveToFolder,
}: Props) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const currentFolder = currentFolderId
    ? folders.find((f) => f.id === currentFolderId) || null
    : null;

  // Filter bookmarks based on current folder
  const filteredBookmarks = currentFolderId
    ? bookmarks.filter((b) => b.folderId === currentFolderId)
    : bookmarks.filter((b) => !b.folderId); // Root level shows bookmarks without folders

  // Get folders to display (only top-level folders at root, child folders when in a folder)
  const foldersToShow = currentFolderId
    ? folders.filter((f) => f.parentId === currentFolderId)
    : folders.filter((f) => !f.parentId); // Root level shows top-level folders

  // Calculate bookmark counts for folders
  const getFolderBookmarkCount = (folderId: string): number => {
    const directBookmarks = bookmarks.filter(
      (b) => b.folderId === folderId
    ).length;
    const childFolders = folders.filter((f) => f.parentId === folderId);
    const childBookmarks = childFolders.reduce(
      (sum, child) => sum + getFolderBookmarkCount(child.id),
      0
    );
    return directBookmarks + childBookmarks;
  };

  const navigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const navigateToRoot = () => {
    setCurrentFolderId(null);
  };

  return (
    <div className="space-y-4 bg-white">
      {/* Breadcrumb Navigation */}
      <FolderBreadcrumb
        currentFolder={currentFolder}
        folders={folders}
        onNavigateToRoot={navigateToRoot}
        onNavigateToFolder={navigateToFolder}
      />

      {/* Current Location Header */}
      <div className="flex items-center gap-2 pb-2 border-b">
        {currentFolder ? (
          <div className="flex items-center gap-2">
            <FolderOpen
              className="h-5 w-5"
              style={{ color: currentFolder.color || "#6b7280" }}
            />
            <div>
              <h3 className="font-semibold">{currentFolder.name}</h3>
              {currentFolder.description && (
                <p className="text-sm text-muted-foreground">
                  {currentFolder.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">All Bookmarks</h3>
          </div>
        )}
      </div>

      {/* Folders Grid */}
      {foldersToShow.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            {currentFolder ? "Subfolders" : "Folders"}
          </h4>
          <div className="grid gap-3">
            {foldersToShow.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                bookmarkCount={getFolderBookmarkCount(folder.id)}
                onClick={() => navigateToFolder(folder.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks List */}
      {filteredBookmarks.length > 0 || loading ? (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            {currentFolder ? `Bookmarks in ${currentFolder.name}` : "Bookmarks"}
            {filteredBookmarks.length > 0 && (
              <span className="ml-2 text-xs">({filteredBookmarks.length})</span>
            )}
          </h4>

          <DraggableBookmarksList
            bookmarks={filteredBookmarks}
            folders={folders}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onNavigate={onNavigate}
            onPageChange={onPageChange}
            onRefresh={onRefresh}
            onMoveToFolder={onMoveToFolder}
          />
        </div>
      ) : (
        !loading &&
        foldersToShow.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              {currentFolder
                ? "No bookmarks in this folder"
                : "No bookmarks found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {currentFolder
                ? "This folder is empty. Drag bookmarks here or create new ones."
                : "Create your first bookmark to save important passages"}
            </p>
          </div>
        )
      )}
    </div>
  );
}
