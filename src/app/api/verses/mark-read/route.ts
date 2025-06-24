import { NextRequest, NextResponse } from "next/server";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../auth";

const prisma = new PrismaClient();

type VerseReference = {
  book: string;
  chapter: number;
  verse: number;
};

type MarkReadRequest = {
  verses: VerseReference[];
  action?: "mark" | "unmark"; // Default to "mark" for backward compatibility
};

/**
 * POST /api/verses/mark-read
 *
 * Body: { verses: [{ book, chapter, verse }], action?: "mark" | "unmark" }
 *
 * Marks or unmarks the specified verses as read for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { verses, action = "mark" } = body;

    if (!Array.isArray(verses) || verses.length === 0) {
      return NextResponse.json(
        { error: "Missing required field: verses (array of verse references)" },
        { status: 400 }
      );
    }

    // Validate verse reference format
    const isValidVerseRef = (ref: any): ref is VerseReference =>
      ref &&
      typeof ref.book === "string" &&
      typeof ref.chapter === "number" &&
      typeof ref.verse === "number";

    if (!verses.every(isValidVerseRef)) {
      return NextResponse.json(
        {
          error:
            "Invalid verse reference format. Expected: { book: string, chapter: number, verse: number }",
        },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Process verses based on action
    if (action === "mark") {
      // Mark verses as read
      const readVerses = pipe(
        verses,
        A.map((verseRef: VerseReference) =>
          prisma.readVerse.upsert({
            where: {
              userId_book_chapter_verse: {
                userId,
                book: verseRef.book.toLowerCase(),
                chapter: verseRef.chapter,
                verse: verseRef.verse,
              },
            },
            update: {
              readAt: new Date(),
            },
            create: {
              userId,
              book: verseRef.book.toLowerCase(),
              chapter: verseRef.chapter,
              verse: verseRef.verse,
              readAt: new Date(),
            },
          })
        )
      );

      await Promise.all(readVerses);
    } else if (action === "unmark") {
      // Unmark verses as read (delete records)
      const deletePromises = pipe(
        verses,
        A.map((verseRef: VerseReference) =>
          prisma.readVerse.deleteMany({
            where: {
              userId,
              book: verseRef.book.toLowerCase(),
              chapter: verseRef.chapter,
              verse: verseRef.verse,
            },
          })
        )
      );

      await Promise.all(deletePromises);
    }

    return NextResponse.json({
      success: true,
      message: `${action === "mark" ? "Marked" : "Unmarked"} ${
        verses.length
      } verses as ${action === "mark" ? "read" : "unread"}`,
    });
  } catch (error) {
    console.error("Error marking verses as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
