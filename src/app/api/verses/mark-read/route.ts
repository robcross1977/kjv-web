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
    const { book, chapter, verses } = body;

    if (!book || !chapter || !Array.isArray(verses)) {
      return NextResponse.json(
        { error: "Missing required fields: book, chapter, verses" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Mark verses as read
    const readVerses = pipe(
      verses,
      A.map((verse: number) =>
        prisma.readVerse.upsert({
          where: {
            userId_book_chapter_verse: {
              userId,
              book: book.toLowerCase(),
              chapter,
              verse,
            },
          },
          update: {
            readAt: new Date(),
          },
          create: {
            userId,
            book: book.toLowerCase(),
            chapter,
            verse,
            readAt: new Date(),
          },
        })
      )
    );

    await Promise.all(readVerses);

    return NextResponse.json({
      success: true,
      message: `Marked ${verses.length} verses as read`,
    });
  } catch (error) {
    console.error("Error marking verses as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
