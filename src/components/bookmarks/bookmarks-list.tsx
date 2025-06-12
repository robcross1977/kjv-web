"use client";

import * as E from "fp-ts/Either";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import { type Bookmark, type UpdateBookmarkRequest } from "@/types/bookmark";
import { formatDistanceToNow } from "date-fns";

type Props = {
  bookmarks: Bookmark[];
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
};

/**
 * Individual bookmark item component
 */
function BookmarkItem({
  bookmark,
  onUpdate,
  onDelete,
  onNavigate,
}: {
  bookmark: Bookmark;
  onUpdate: (
    id: string,
    data: UpdateBookmarkRequest
  ) => Promise<E.Either<string, Bookmark>>;
  onDelete: (id: string) => Promise<E.Either<string, boolean>>;
  onNavigate: (id: string) => Promise<E.Either<string, Bookmark>>;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{bookmark.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {bookmark.normalizedRef}
            </p>
            {bookmark.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {bookmark.description}
              </p>
            )}
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
              <DropdownMenuItem>
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
    </Card>
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
 * Main bookmarks list component
 */
export function BookmarksList({
  bookmarks,
  loading,
  page,
  totalPages,
  onUpdate,
  onDelete,
  onNavigate,
  onPageChange,
  onRefresh,
}: Props) {
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

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
