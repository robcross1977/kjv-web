"use client";

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { CheckCircle, Circle } from "lucide-react";
import { ReadStatus } from "@/types/read-status";

type Props = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  readStatus: ReadStatus;
  isToolsActive: boolean;
  onToggleReadStatus: (book: string, chapter: number, verse: number) => void;
};

/**
 * Simplified verse component with direct read status toggle
 * Shows a single circle on the left that can be clicked to mark as read/unread
 */
export function SelectableVerse({
  book,
  chapter,
  verse,
  text,
  readStatus,
  isToolsActive,
  onToggleReadStatus,
}: Props) {
  const handleCircleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToolsActive) {
      onToggleReadStatus(book, chapter, verse);
    }
  };

  const getReadStatusIcon = () => {
    return pipe(
      readStatus,
      O.fromPredicate((status): status is "read" => status === "read"),
      O.fold(
        () => (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-200" />
        ),
        () => (
          <CheckCircle className="h-5 w-5 text-green-600 cursor-pointer hover:text-green-700 transition-colors duration-200" />
        )
      )
    );
  };

  const getVerseNumberStyles = () => {
    if (isToolsActive) {
      return "font-semibold text-primary mr-2";
    }

    // When tools are hidden, show green circle around verse number if read
    return pipe(
      readStatus,
      O.fromPredicate((status): status is "read" => status === "read"),
      O.fold(
        () => "font-semibold text-primary mr-2",
        () =>
          "font-semibold text-green-600 mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full border border-green-600 text-xs"
      )
    );
  };

  return (
    <div className="relative p-2 rounded-md transition-all duration-200 hover:bg-accent/50">
      {/* Read status circle - only visible when tools are active */}
      {isToolsActive && (
        <div
          className="absolute top-2 left-2"
          onClick={handleCircleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCircleClick(e as any);
            }
          }}
        >
          {getReadStatusIcon()}
        </div>
      )}

      {/* Verse content */}
      <div className={`${isToolsActive ? "ml-8" : "ml-2"}`}>
        <span className={getVerseNumberStyles()}>{verse}</span>
        <span className="text-foreground leading-relaxed">{text}</span>
      </div>
    </div>
  );
}
