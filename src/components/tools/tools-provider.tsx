"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";
import { useReadStatus } from "@/hooks/use-read-status";
import { ToolsSheet, ToolSection } from "./tools-sheet";
import { VerseReference } from "@/types/read-status";

type ToolsContextValue = {
  // Tools state
  isToolsActive: boolean;
  isToolsSheetOpen: boolean;
  activeToolSection: ToolSection;

  // Tools actions
  toggleTools: () => void;
  closeTools: () => void;
  openToolsSheet: (section?: ToolSection) => void;
  closeToolsSheet: () => void;
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
  isAuthLoading: boolean;
};

const ToolsContext = createContext<ToolsContextValue | null>(null);

type Props = {
  children: ReactNode;
};

/**
 * Simplified tools provider that manages read status directly
 * No complex selection logic - just direct read/unread toggling
 * Only available when user is logged in
 * Uses NextAuth.js v5 for authentication
 */
export function ToolsProvider({ children }: Props) {
  const [isToolsActive, setIsToolsActive] = useState(false);
  const [isToolsSheetOpen, setIsToolsSheetOpen] = useState(false);
  const [activeToolSection, setActiveToolSection] =
    useState<ToolSection>("search");
  const [currentVerses, setCurrentVerses] = useState<VerseReference[]>([]);

  // Use NextAuth.js v5 session
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user;
  const isAuthLoading = status === "loading";

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

  const openToolsSheet = useCallback((section: ToolSection = "search") => {
    setActiveToolSection(section);
    setIsToolsSheetOpen(true);
  }, []);

  const closeToolsSheet = useCallback(() => {
    setIsToolsSheetOpen(false);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts if not typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "t":
          if (isLoggedIn) {
            event.preventDefault();
            if (isToolsSheetOpen) {
              closeToolsSheet();
            } else {
              openToolsSheet("reading");
            }
          }
          break;
        case "/":
          event.preventDefault();
          openToolsSheet("search");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLoggedIn, isToolsSheetOpen, openToolsSheet, closeToolsSheet]);

  const contextValue: ToolsContextValue = {
    // Tools state
    isToolsActive: isLoggedIn && isToolsActive, // Only active if logged in
    isToolsSheetOpen,
    activeToolSection,

    // Tools actions
    toggleTools,
    closeTools,
    openToolsSheet,
    closeToolsSheet,
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
    isAuthLoading,
  };

  return (
    <ToolsContext.Provider value={contextValue}>
      {children}

      {/* Tools sheet */}
      <ToolsSheet
        isOpen={isToolsSheetOpen}
        onOpenChange={setIsToolsSheetOpen}
        defaultSection={activeToolSection}
        currentContext={{
          book: currentVerses[0]?.book,
          chapter: currentVerses[0]?.chapter,
          verses: currentVerses.map((v) => v.verse),
        }}
      />
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
