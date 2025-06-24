import { NextRequest, NextResponse } from "next/server";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import { auth } from "../../../../../auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/verses/read-status
 *
 * Query params:
 * - book: string
 * - chapter: number
 * - verses: number[] (comma-separated)
 *
 * Returns array of read verse objects for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const book = searchParams.get("book");
    const chapterStr = searchParams.get("chapter");
    const versesStr = searchParams.get("verses");

    if (!book || !chapterStr || !versesStr) {
      return NextResponse.json(
        { error: "Missing required parameters: book, chapter, verses" },
        { status: 400 }
      );
    }

    const chapter = parseInt(chapterStr);
    const verses = versesStr.split(",").map(Number);

    if (isNaN(chapter) || verses.some(isNaN)) {
      return NextResponse.json(
        { error: "Invalid chapter or verse numbers" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Get read status for all requested verses
    const readVerses = await prisma.readVerse.findMany({
      where: {
        userId,
        book: book.toLowerCase(),
        chapter,
        verse: { in: verses },
      },
      select: {
        verse: true,
        readAt: true,
      },
    });

    // Create array of read verses in the format expected by frontend
    const readVersesList = pipe(
      readVerses,
      A.map((rv) => ({
        book: book.toLowerCase(),
        chapter,
        verse: rv.verse,
        readAt: rv.readAt?.toISOString() || null,
      }))
    );

    return NextResponse.json({
      success: true,
      readVerses: readVersesList,
    });
  } catch (error) {
    console.error("Error getting read status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
