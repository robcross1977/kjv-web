"use client";

import { useState } from "react";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, BarChart3, BookCheck, BookX } from "lucide-react";
import { useSession } from "next-auth/react";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { BIBLE_BOOKS } from "@/lib/bible-stats";
import { ValidBookName } from "kingjames";
import { useToast } from "@/hooks/use-toast";

type Props = {
  currentContext?: {
    book?: string;
    chapter?: number;
    verses?: number[];
  };
};

/**
 * Reading section for the unified tools sheet
 * Contains current chapter context and reading progress tracking
 */
export function ReadingSection({ currentContext }: Props) {
  // Get actual authentication status from NextAuth
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user;
  const isAuthLoading = status === "loading";

  // Get reading progress data
  const {
    data: progressData,
    isLoading: isProgressLoading,
    error: progressError,
    refetch,
  } = useReadingProgress();

  // Book marking state
  const [selectedBook, setSelectedBook] = useState<ValidBookName | "">("");
  const [isMarkingBook, setIsMarkingBook] = useState(false);
  const { toast } = useToast();

  const getCurrentChapterInfo = () => {
    return pipe(
      currentContext,
      O.fromNullable,
      O.chain((ctx) =>
        pipe(
          [ctx.book, ctx.chapter] as const,
          O.fromPredicate(([book, chapter]) => !!book && !!chapter),
          O.map(([book, chapter]) => ({
            book: book!,
            chapter: chapter!,
            verseCount: ctx.verses?.length || 0,
          }))
        )
      )
    );
  };

  const formatChapterTitle = (book: string, chapter: number): string => {
    const capitalizedBook = book.charAt(0).toUpperCase() + book.slice(1);
    return `${capitalizedBook} ${chapter}`;
  };

  const formatBookName = (book: ValidBookName): string => {
    return book
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const markBookAsRead = async (action: "mark_read" | "mark_unread") => {
    if (!selectedBook) return;

    setIsMarkingBook(true);

    const result = await pipe(
      TE.tryCatch(
        async () => {
          const response = await fetch("/api/verses/mark-book-read", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              book: selectedBook,
              action,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update book");
          }

          return response.json();
        },
        (error) => `Failed to mark book: ${String(error)}`
      )
    )();

    setIsMarkingBook(false);

    if (E.isLeft(result)) {
      toast({
        title: "Error",
        description: result.left,
        variant: "destructive",
      });
      return;
    }

    const actionText = action === "mark_read" ? "read" : "unread";
    toast({
      title: "Success",
      description: `Marked ${formatBookName(selectedBook)} as ${actionText}`,
    });

    // Refresh progress data
    refetch();
    setSelectedBook("");
  };

  if (isAuthLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            Reading Tools
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            Reading Tools
          </CardTitle>
          <CardDescription>
            Sign in to access reading tools and track your progress
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Chapter Context */}
      {pipe(
        getCurrentChapterInfo(),
        O.fold(
          () => (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4" />
                  Current Chapter
                </CardTitle>
                <CardDescription>
                  Navigate to a chapter to see context
                </CardDescription>
              </CardHeader>
            </Card>
          ),
          ({ book, chapter, verseCount }) => (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4" />
                  {formatChapterTitle(book, chapter)}
                </CardTitle>
                <CardDescription>
                  {verseCount} verses in this chapter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chapter context for reading tools
                </p>
              </CardContent>
            </Card>
          )
        )
      )}

      {/* Mark Whole Book */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookCheck className="h-4 w-4" />
            Mark Whole Book
          </CardTitle>
          <CardDescription>Mark entire books as read or unread</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Select
              value={selectedBook}
              onValueChange={(value) => setSelectedBook(value as ValidBookName)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a book..." />
              </SelectTrigger>
              <SelectContent>
                {BIBLE_BOOKS.map((book) => (
                  <SelectItem key={book} value={book}>
                    {formatBookName(book)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                onClick={() => markBookAsRead("mark_read")}
                disabled={!selectedBook || isMarkingBook}
                className="flex-1"
                size="sm"
              >
                <BookCheck className="h-4 w-4 mr-2" />
                Mark as Read
              </Button>
              <Button
                onClick={() => markBookAsRead("mark_unread")}
                disabled={!selectedBook || isMarkingBook}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <BookX className="h-4 w-4 mr-2" />
                Mark as Unread
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reading Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Reading Progress
          </CardTitle>
          <CardDescription>Track your Bible reading journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              {isProgressLoading ? (
                <span>Loading...</span>
              ) : progressError ? (
                <span className="text-destructive">Error</span>
              ) : (
                <span>{progressData?.progressPercentage.toFixed(1) || 0}%</span>
              )}
            </div>
            <Progress
              value={progressData?.progressPercentage || 0}
              className="h-2"
            />
            {isProgressLoading ? (
              <p className="text-xs text-muted-foreground">
                Loading your reading progress...
              </p>
            ) : progressError ? (
              <p className="text-xs text-destructive">
                Failed to load progress. Please try again.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {progressData?.readVersesCount || 0} verses read across all
                books
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
