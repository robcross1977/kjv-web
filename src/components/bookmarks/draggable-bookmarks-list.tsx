"use client";

import * as E from "fp-ts/Either";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Folder,
} from "lucide-react";
import { type Bookmark, type UpdateBookmarkRequest } from "@/types/bookmark";
import { type BookmarkFolder } from "@/types/bookmark-folder";
import { formatDistanceToNow } from "date-fns";
import { EditBookmarkForm } from "./edit-bookmark-form";

type Props = {
  bookmarks: Bookmark[];
  folders: BookmarkFolder[];
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
 * Draggable bookmark item component
 */
function DraggableBookmarkItem({
  bookmark,
  folders,
  onUpdate,
  onDelete,
  onNavigate,
}: {
  bookmark: Bookmark;
  folders: BookmarkFolder[];
  onUpdate: (
    id: string,
    data: UpdateBookmarkRequest
  ) => Promise<E.Either<string, Bookmark>>;
  onDelete: (id: string) => Promise<E.Either<string, boolean>>;
  onNavigate: (id: string) => Promise<E.Either<string, Bookmark>>;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: bookmark.id,
    data: {
      type: "bookmark",
      bookmark,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleNavigate = async () => {
    const result = await onNavigate(bookmark.id);

    if (E.isRight(result)) {
      // Navigate to the bookmark reference
      const { book, startChapter, startVerse } = bookmark;
      const url = startVerse
        ? `/?book=${book}&chapter=${startChapter}&verse=${startVerse}`
        : `/?book=${book}&chapter=${startChapter}`;
      router.push(url);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${bookmark.name}"?`)) {
      setIsDeleting(true);
      await onDelete(bookmark.id);
      setIsDeleting(false);
    }
  };

  const handleEdit = async (data: UpdateBookmarkRequest): Promise<boolean> => {
    const result = await onUpdate(bookmark.id, data);
    if (E.isRight(result)) {
      setIsEditDialogOpen(false);
      return true;
    }
    return false;
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="hover:shadow-md transition-shadow bg-white"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">
                {bookmark.name}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {bookmark.normalizedRef}
              </p>
              {bookmark.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {bookmark.description}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleNavigate}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to passage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {bookmark.folderId && (
              <div className="flex items-center gap-1">
                <Folder className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">
                  {folders.find((f) => f.id === bookmark.folderId)?.name ||
                    "Unknown Folder"}
                </span>
              </div>
            )}

            {bookmark.category && (
              <Badge variant="outline" className="text-xs">
                {bookmark.category}
              </Badge>
            )}

            {bookmark.tags && bookmark.tags.length > 0 && (
              <>
                {bookmark.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {bookmark.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{bookmark.tags.length - 2}
                  </Badge>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {bookmark.accessCount > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {bookmark.accessCount}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(bookmark.createdAt)}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Bookmark
            </DialogTitle>
            <DialogDescription>
              Update the details of your bookmark.
            </DialogDescription>
          </DialogHeader>

          <EditBookmarkForm
            bookmark={bookmark}
            onSubmit={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            folders={folders}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/**
 * Droppable folder component
 */
function DroppableFolder({
  folder,
  bookmarkCount,
}: {
  folder: BookmarkFolder;
  bookmarkCount: number;
}) {
  const { setNodeRef, isOver } = useSortable({
    id: `folder-${folder.id}`,
    data: {
      type: "folder",
      folder,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 p-3 rounded-lg border-2 border-dashed transition-colors ${
        isOver
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <Folder
        className="h-5 w-5"
        style={{ color: folder.color || "#6b7280" }}
      />
      <div className="flex-1">
        <span className="font-medium text-sm">{folder.name}</span>
        <p className="text-xs text-muted-foreground">
          {bookmarkCount} bookmark{bookmarkCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

/**
 * Droppable no-folder zone component
 */
function DroppableNoFolder({ bookmarkCount }: { bookmarkCount: number }) {
  const { setNodeRef, isOver } = useSortable({
    id: "no-folder",
    data: {
      type: "no-folder",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 p-3 rounded-lg border-2 border-dashed transition-colors ${
        isOver
          ? "border-gray-500 bg-gray-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <BookOpen className="h-5 w-5 text-gray-500" />
      <div className="flex-1">
        <span className="font-medium text-sm">No Folder</span>
        <p className="text-xs text-muted-foreground">
          {bookmarkCount} bookmark{bookmarkCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for bookmark items
 */
function BookmarkSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Pagination component
 */
function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * Main draggable bookmarks list component
 */
export function DraggableBookmarksList({
  bookmarks,
  folders,
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedBookmark, setDraggedBookmark] = useState<Bookmark | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    if (active.data.current?.type === "bookmark") {
      setDraggedBookmark(active.data.current.bookmark);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setDraggedBookmark(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle dropping bookmark onto folder
    if (activeData?.type === "bookmark" && overData?.type === "folder") {
      const bookmarkId = active.id as string;
      const folderId = overData.folder.id;

      await onMoveToFolder(bookmarkId, folderId);
    }

    // Handle dropping bookmark onto "no folder" area (remove from folder)
    if (
      activeData?.type === "bookmark" &&
      (over.id === "no-folder" || overData?.type === "no-folder")
    ) {
      const bookmarkId = active.id as string;
      await onMoveToFolder(bookmarkId, null);
    }

    setActiveId(null);
    setDraggedBookmark(null);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <BookmarkSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No bookmarks found</h3>
        <p className="text-muted-foreground mb-4">
          Create your first bookmark to save important passages
        </p>
      </div>
    );
  }

  const folderBookmarkCounts = folders.reduce((acc, folder) => {
    acc[folder.id] = bookmarks.filter((b) => b.folderId === folder.id).length;
    return acc;
  }, {} as Record<string, number>);

  const unfolderBookmarkCount = bookmarks.filter((b) => !b.folderId).length;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4 bg-white">
        {/* Drop Zones - Folders */}
        {folders.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Drop bookmarks into folders:
            </h4>
            <SortableContext
              items={[...folders.map((f) => `folder-${f.id}`), "no-folder"]}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-2">
                {folders.map((folder) => (
                  <DroppableFolder
                    key={folder.id}
                    folder={folder}
                    bookmarkCount={folderBookmarkCounts[folder.id] || 0}
                  />
                ))}

                {/* No folder drop zone */}
                <DroppableNoFolder bookmarkCount={unfolderBookmarkCount} />
              </div>
            </SortableContext>
          </div>
        )}

        {/* Bookmarks List */}
        <div className="space-y-3">
          <SortableContext
            items={bookmarks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {bookmarks.map((bookmark) => (
              <DraggableBookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                folders={folders}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onNavigate={onNavigate}
              />
            ))}
          </SortableContext>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && draggedBookmark ? (
          <Card className="rotate-2 shadow-lg opacity-90 bg-white">
            <CardHeader className="pb-2">
              <h4 className="font-semibold text-sm">{draggedBookmark.name}</h4>
              <p className="text-sm text-muted-foreground">
                {draggedBookmark.normalizedRef}
              </p>
            </CardHeader>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
