import { useState, useEffect, useCallback } from "react";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import {
  type BookmarkFolder,
  type CreateBookmarkFolderRequest,
  type UpdateBookmarkFolderRequest,
  type FolderTreeNode,
} from "@/types/bookmark-folder";

type FolderState = {
  folders: BookmarkFolder[];
  loading: boolean;
  error: string | null;
};

/**
 * Hook to manage bookmark folders
 */
export function useBookmarkFolders(enabled: boolean = true) {
  const [state, setState] = useState<FolderState>({
    folders: [],
    loading: false,
    error: null,
  });

  /**
   * Fetch all folders for the user
   */
  const fetchFolders = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const result = await pipe(
      TE.tryCatch(
        async () => {
          const response = await fetch("/api/bookmark-folders", {
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch folders");
          }

          return (await response.json()) as BookmarkFolder[];
        },
        (error) => `Error fetching folders: ${error}`
      )
    )();

    if (E.isRight(result)) {
      setState((prev) => ({
        ...prev,
        folders: result.right,
        loading: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        error: result.left,
        loading: false,
      }));
    }
  }, []);

  /**
   * Create a new folder
   */
  const createFolder = useCallback(
    async (
      data: CreateBookmarkFolderRequest
    ): Promise<E.Either<string, BookmarkFolder>> => {
      const result = await pipe(
        TE.tryCatch(
          async () => {
            const response = await fetch("/api/bookmark-folders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
              credentials: "include",
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to create folder");
            }

            return (await response.json()) as BookmarkFolder;
          },
          (error) => `Error creating folder: ${error}`
        )
      )();

      if (E.isRight(result)) {
        // Add the new folder to local state
        setState((prev) => ({
          ...prev,
          folders: [...prev.folders, result.right],
        }));
      }

      return result;
    },
    []
  );

  /**
   * Build folder tree structure from flat array
   */
  const buildFolderTree = useCallback(
    (folders: BookmarkFolder[]): FolderTreeNode[] => {
      const folderMap = new Map<string, BookmarkFolder>();
      const rootFolders: BookmarkFolder[] = [];

      // First pass: create map and identify root folders
      folders.forEach((folder) => {
        folderMap.set(folder.id, folder);
        if (!folder.parentId) {
          rootFolders.push(folder);
        }
      });

      // Recursive function to build tree
      const buildNode = (folder: BookmarkFolder): FolderTreeNode => {
        const children = folders
          .filter((f) => f.parentId === folder.id)
          .map(buildNode);

        const bookmarkCount = folder._count?.bookmarks || 0;
        const totalBookmarkCount = children.reduce(
          (sum, child) => sum + child.totalBookmarkCount,
          bookmarkCount
        );

        return {
          folder,
          children,
          bookmarkCount,
          totalBookmarkCount,
        };
      };

      return rootFolders.map(buildNode);
    },
    []
  );

  /**
   * Get folder tree structure
   */
  const folderTree = useCallback(() => {
    return buildFolderTree(state.folders);
  }, [state.folders, buildFolderTree]);

  /**
   * Get folders as flat list with hierarchy indicators
   */
  const getFlatFolderList = useCallback(() => {
    const tree = folderTree();
    const flatList: (BookmarkFolder & { level: number; path: string })[] = [];

    const traverse = (
      nodes: FolderTreeNode[],
      level: number = 0,
      path: string = ""
    ) => {
      nodes.forEach((node) => {
        const currentPath = path
          ? `${path} > ${node.folder.name}`
          : node.folder.name;
        flatList.push({
          ...node.folder,
          level,
          path: currentPath,
        });
        traverse(node.children, level + 1, currentPath);
      });
    };

    traverse(tree);
    return flatList;
  }, [folderTree]);

  /**
   * Get folders by parent ID
   */
  const getFoldersByParent = useCallback(
    (parentId: string | null) => {
      return pipe(
        state.folders,
        A.filter((folder) => folder.parentId === parentId)
      );
    },
    [state.folders]
  );

  /**
   * Find folder by ID
   */
  const findFolderById = useCallback(
    (id: string) => {
      return pipe(
        state.folders,
        A.findFirst((folder) => folder.id === id)
      );
    },
    [state.folders]
  );

  /**
   * Refresh folders
   */
  const refresh = useCallback(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchFolders();
    }
  }, [enabled, fetchFolders]);

  return {
    // State
    folders: state.folders,
    loading: state.loading,
    error: state.error,

    // Computed values
    folderTree: folderTree(),
    flatFolderList: getFlatFolderList(),

    // Actions
    createFolder,
    refresh,

    // Utilities
    getFoldersByParent,
    findFolderById,
  };
}
