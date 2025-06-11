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
};

const ToolsContext = createContext<ToolsContextValue | null>(null);

type Props = {
  children: ReactNode;
};

/**
 * Simplified tools provider that manages read status directly
 * No complex selection logic - just direct read/unread toggling
 */
export function ToolsProvider({ children }: Props) {
  const [isToolsActive, setIsToolsActive] = useState(false);
  const [currentVerses, setCurrentVerses] = useState<VerseReference[]>([]);

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
    setIsToolsActive((prev) => !prev);
  }, []);

  const closeTools = useCallback(() => {
    setIsToolsActive(false);
  }, []);

  const toggleVerseReadStatus = useCallback(
    async (book: string, chapter: number, verse: number) => {
      const currentStatus = getVerseReadStatus(book, chapter, verse);
      const verseRef: VerseReference = { book, chapter, verse };

      if (currentStatus === "read") {
        await markVersesAsUnread([verseRef]);
      } else {
        await markVersesAsRead([verseRef]);
      }
    },
    [getVerseReadStatus, markVersesAsRead, markVersesAsUnread]
  );

  const markAllAsRead = useCallback(async () => {
    if (currentVerses.length > 0) {
      await markVersesAsRead(currentVerses);
    }
  }, [currentVerses, markVersesAsRead]);

  const contextValue: ToolsContextValue = {
    // Tools state
    isToolsActive,

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
  };

  return (
    <ToolsContext.Provider value={contextValue}>
      {children}

      {/* Floating tools button */}
      <FloatingToolsButton isActive={isToolsActive} onToggle={toggleTools} />
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
