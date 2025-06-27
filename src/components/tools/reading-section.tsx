"use client";

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, BarChart3 } from "lucide-react";
import { useSession } from "next-auth/react";

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
              <span>0%</span>
            </div>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Coming soon: Track your reading across all books
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
