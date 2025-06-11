"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import { useUser } from "@auth0/nextjs-auth0";
import { useReadStatus } from "@/hooks/use-read-status";
import { FloatingToolsButton } from "./floating-tools-button";
import { VerseReference } from "@/types/read-status";

type ToolsContextValue = {
  // Tools state
  isToolsActive: boolean;

  // Tools actions
  toggleTools: () => void;
  closeTools: () => void;
  toggleVerseReadStatus: (
    book: string,
    chapter: number,
    verse: number
  ) => Promise<void>;
  markAllAsRead: () => Promise<void>;

  // Read status
  getVerseReadStatus: (
    book: string,
    chapter: number,
    verse: number
  ) => "read" | "unread";
  fetchReadStatus: (
    book: string,
    chapter: number,
    verses: number[]
  ) => Promise<void>;

  // Current verses context
  setCurrentVerses: (verses: VerseReference[]) => void;

  // Loading states
  isLoading: boolean;
  error: string | null;
  clearError: () => void;

  // Auth state
  isLoggedIn: boolean;
};

const ToolsContext = createContext<ToolsContextValue | null>(null);

type Props = {
  children: ReactNode;
};

/**
 * Simplified tools provider that manages read status directly
 * No complex selection logic - just direct read/unread toggling
 * Only available when user is logged in
 */
export function ToolsProvider({ children }: Props) {
  const [isToolsActive, setIsToolsActive] = useState(false);
  const [currentVerses, setCurrentVerses] = useState<VerseReference[]>([]);

  // Check if user is logged in
  const { user, isLoading: userLoading } = useUser();
  const isLoggedIn = !userLoading && !!user;

  const {
    isLoading,
    error,
    fetchReadStatus,
    markVersesAsRead,
    markVersesAsUnread,
    getVerseReadStatus,
    clearError,
  } = useReadStatus();

  const toggleTools = useCallback(() => {
    // Only allow toggling tools if user is logged in
    if (isLoggedIn) {
      setIsToolsActive((prev) => !prev);
    }
  }, [isLoggedIn]);

  const closeTools = useCallback(() => {
    setIsToolsActive(false);
  }, []);

  const toggleVerseReadStatus = useCallback(
    async (book: string, chapter: number, verse: number) => {
      if (!isLoggedIn) return;

      const currentStatus = getVerseReadStatus(book, chapter, verse);
      const verseRef: VerseReference = { book, chapter, verse };

      if (currentStatus === "read") {
        await markVersesAsUnread([verseRef]);
      } else {
        await markVersesAsRead([verseRef]);
      }
    },
    [isLoggedIn, getVerseReadStatus, markVersesAsRead, markVersesAsUnread]
  );

  const markAllAsRead = useCallback(async () => {
    if (!isLoggedIn || currentVerses.length === 0) return;

    await markVersesAsRead(currentVerses);
  }, [isLoggedIn, currentVerses, markVersesAsRead]);

  const contextValue: ToolsContextValue = {
    // Tools state
    isToolsActive: isLoggedIn && isToolsActive, // Only active if logged in

    // Tools actions
    toggleTools,
    closeTools,
    toggleVerseReadStatus,
    markAllAsRead,

    // Read status
    getVerseReadStatus,
    fetchReadStatus,

    // Current verses context
    setCurrentVerses,

    // Loading states
    isLoading,
    error,
    clearError,

    // Auth state
    isLoggedIn,
  };

  return (
    <ToolsContext.Provider value={contextValue}>
      {children}

      {/* Floating tools button - only show if logged in */}
      {isLoggedIn && (
        <FloatingToolsButton isActive={isToolsActive} onToggle={toggleTools} />
      )}
    </ToolsContext.Provider>
  );
}

/**
 * Hook to use tools context
 */
export function useTools() {
  const context = useContext(ToolsContext);

  if (!context) {
    throw new Error("useTools must be used within a ToolsProvider");
  }

  return context;
}
