import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare } from "lucide-react";
import { ValidBookName } from "kingjames";
import { useState } from "react";
import { CommentaryDialog } from "./commentary-dialog";

type Props = {
  book: ValidBookName;
  chapter: number;
  verse?: number;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
};

/**
 * Commentary button that opens AI-powered Independent Baptist commentary
 * Works for both chapter-level and verse-level commentary
 */
export function CommentaryButton({
  book,
  chapter,
  verse,
  variant = "ghost",
  size = "sm",
  className = "",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const isVerseCommentary = verse !== undefined;
  const buttonText = isVerseCommentary
    ? "Verse Commentary"
    : "Chapter Commentary";
  const icon = isVerseCommentary ? MessageSquare : BookOpen;
  const IconComponent = icon;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
        title={buttonText}
      >
        <IconComponent className="h-4 w-4" />
        {size !== "sm" && <span>{buttonText}</span>}
      </Button>

      {isOpen && (
        <CommentaryDialog
          book={book}
          chapter={chapter}
          verse={verse}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
