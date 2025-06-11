"use client";

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Circle, RotateCcw } from "lucide-react";
import { useTools } from "./tools-provider";

type Props = {
  currentContext?: {
    book?: string;
    chapter?: number;
    verses?: number[];
  };
};

/**
 * Reading section for the unified tools sheet
 * Contains mark-as-read functionality and reading progress tracking
 */
export function ReadingSection({ currentContext }: Props) {
  const { markAllAsRead, isLoading, error, clearError } = useTools();

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

  const handleMarkAllAsRead = async () => {
    if (error) clearError();
    await markAllAsRead();
  };

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
                  No Chapter Selected
                </CardTitle>
                <CardDescription>
                  Navigate to a chapter to see reading tools
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
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleMarkAllAsRead}
                    disabled={isLoading}
                    className="w-full"
                    variant="default"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isLoading ? "Marking..." : "Mark All as Read"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={true} // TODO: Implement mark all as unread
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Mark All as Unread
                  </Button>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearError}
                      className="mt-2 h-auto p-0 text-destructive hover:text-destructive"
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        )
      )}

      {/* Reading Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reading Progress</CardTitle>
          <CardDescription>Track your Bible reading journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>0%</span>
            </div>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Coming soon: Track your reading across all books
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
          <CardDescription>Common reading tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" disabled>
            <Circle className="h-4 w-4 mr-2" />
            Mark Verse as Read
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <BookOpen className="h-4 w-4 mr-2" />
            Reading Plan
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            More features coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
