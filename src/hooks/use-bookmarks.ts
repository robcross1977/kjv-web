import { useState, useEffect, useCallback } from "react";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import {
  type Bookmark,
  type CreateBookmarkRequest,
  type UpdateBookmarkRequest,
  type BookmarkSearchParams,
  type BookmarkListResponse,
} from "@/types/bookmark";

type BookmarkState = {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
};

/**
 * Custom hook for managing bookmarks
 */
export function useBookmarks(initialParams?: Partial<BookmarkSearchParams>) {
  const [state, setState] = useState<BookmarkState>({
    bookmarks: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 0,
  });

  const [searchParams, setSearchParams] = useState<BookmarkSearchParams>({
    query: undefined,
    book: undefined,
    category: undefined,
    tags: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 20,
    ...initialParams,
  });

  /**
   * Fetch bookmarks from the API
   */
  const fetchBookmarks = useCallback(async (params: BookmarkSearchParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const result = await pipe(
      TE.tryCatch(
        async () => {
          const searchParams = new URLSearchParams();

          if (params.query) searchParams.set("query", params.query);
          if (params.book) searchParams.set("book", params.book);
          if (params.category) searchParams.set("category", params.category);
          if (params.tags && params.tags.length > 0) {
            searchParams.set("tags", params.tags.join(","));
          }
          searchParams.set("sortBy", params.sortBy);
          searchParams.set("sortOrder", params.sortOrder);
          searchParams.set("page", params.page.toString());
          searchParams.set("limit", params.limit.toString());

          const response = await fetch(`/api/bookmarks?${searchParams}`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch bookmarks");
          }

          return (await response.json()) as BookmarkListResponse;
        },
        (error) => `Error fetching bookmarks: ${error}`
      )
    )();

    if (E.isLeft(result)) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: result.left,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: null,
        bookmarks: result.right.bookmarks,
        total: result.right.total,
        page: result.right.page,
        totalPages: result.right.totalPages,
      }));
    }
  }, []);

  /**
   * Create a new bookmark
   */
  const createBookmark = useCallback(
    async (
      data: CreateBookmarkRequest
    ): Promise<E.Either<string, Bookmark>> => {
      const result = await pipe(
        TE.tryCatch(
          async () => {
            const response = await fetch("/api/bookmarks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to create bookmark");
            }

            return (await response.json()) as Bookmark;
          },
          (error) => `Error creating bookmark: ${error}`
        )
      )();

      if (E.isRight(result)) {
        // Refresh bookmarks after creation
        await fetchBookmarks(searchParams);
      }

      return result;
    },
    [searchParams, fetchBookmarks]
  );

  /**
   * Update an existing bookmark
   */
  const updateBookmark = useCallback(
    async (
      id: string,
      data: UpdateBookmarkRequest
    ): Promise<E.Either<string, Bookmark>> => {
      const result = await pipe(
        TE.tryCatch(
          async () => {
            const response = await fetch(`/api/bookmarks/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to update bookmark");
            }

            return (await response.json()) as Bookmark;
          },
          (error) => `Error updating bookmark: ${error}`
        )
      )();

      if (E.isRight(result)) {
        // Update the bookmark in local state
        setState((prev) => ({
          ...prev,
          bookmarks: prev.bookmarks.map((bookmark) =>
            bookmark.id === id ? result.right : bookmark
          ),
        }));
      }

      return result;
    },
    []
  );

  /**
   * Delete a bookmark
   */
  const deleteBookmark = useCallback(
    async (id: string): Promise<E.Either<string, boolean>> => {
      const result = await pipe(
        TE.tryCatch(
          async () => {
            const response = await fetch(`/api/bookmarks/${id}`, {
              method: "DELETE",
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to delete bookmark");
            }

            return true;
          },
          (error) => `Error deleting bookmark: ${error}`
        )
      )();

      if (E.isRight(result)) {
        // Remove the bookmark from local state
        setState((prev) => ({
          ...prev,
          bookmarks: prev.bookmarks.filter((bookmark) => bookmark.id !== id),
          total: prev.total - 1,
        }));
      }

      return result;
    },
    []
  );

  /**
   * Navigate to a bookmark (increment access count)
   */
  const navigateToBookmark = useCallback(
    async (id: string): Promise<E.Either<string, Bookmark>> => {
      const result = await pipe(
        TE.tryCatch(
          async () => {
            const response = await fetch(`/api/bookmarks/${id}`);

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to access bookmark");
            }

            return (await response.json()) as Bookmark;
          },
          (error) => `Error accessing bookmark: ${error}`
        )
      )();

      if (E.isRight(result)) {
        // Update the bookmark in local state with new access count
        setState((prev) => ({
          ...prev,
          bookmarks: prev.bookmarks.map((bookmark) =>
            bookmark.id === id ? result.right : bookmark
          ),
        }));
      }

      return result;
    },
    []
  );

  /**
   * Update search parameters and fetch bookmarks
   */
  const updateSearch = useCallback(
    (newParams: Partial<BookmarkSearchParams>) => {
      const updatedParams = { ...searchParams, ...newParams, page: 1 }; // Reset to page 1 on new search
      setSearchParams(updatedParams);
      fetchBookmarks(updatedParams);
    },
    [searchParams, fetchBookmarks]
  );

  /**
   * Go to a specific page
   */
  const goToPage = useCallback(
    (page: number) => {
      const updatedParams = { ...searchParams, page };
      setSearchParams(updatedParams);
      fetchBookmarks(updatedParams);
    },
    [searchParams, fetchBookmarks]
  );

  /**
   * Refresh current bookmarks
   */
  const refresh = useCallback(() => {
    fetchBookmarks(searchParams);
  }, [searchParams, fetchBookmarks]);

  // Initial fetch
  useEffect(() => {
    fetchBookmarks(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    // State
    bookmarks: state.bookmarks,
    loading: state.loading,
    error: state.error,
    total: state.total,
    page: state.page,
    totalPages: state.totalPages,
    searchParams,

    // Actions
    createBookmark,
    updateBookmark,
    deleteBookmark,
    navigateToBookmark,
    updateSearch,
    goToPage,
    refresh,
  };
}
