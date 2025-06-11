import { NextRequest, NextResponse } from "next/server";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import { PrismaClient } from "@prisma/client";
import { auth0 } from "@/lib/auth0";

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
  const result = await pipe(
    TE.tryCatch(
      async () => {
        // Temporarily use demo user for testing
        // TODO: Re-enable authentication once Auth0 is working
        const userId = "demo-user";
        const { searchParams } = new URL(request.url);
        const book = searchParams.get("book");
        const chapter = searchParams.get("chapter");
        const versesParam = searchParams.get("verses");

        if (!book || !chapter || !versesParam) {
          throw new Error("Missing required parameters: book, chapter, verses");
        }

        const verses = pipe(
          versesParam.split(","),
          A.map((v) => parseInt(v.trim())),
          A.filter((v) => !isNaN(v))
        );

        if (verses.length === 0) {
          throw new Error("Invalid verses parameter");
        }

        // Query database for read verses
        const readVerses = await prisma.readVerse.findMany({
          where: {
            userId,
            book,
            chapter: parseInt(chapter),
            verse: {
              in: verses,
            },
          },
          select: {
            book: true,
            chapter: true,
            verse: true,
            readAt: true,
          },
        });

        return {
          userId,
          book,
          chapter: parseInt(chapter),
          verses,
          readVerses,
        };
      },
      (error) => `Error: ${error}`
    )
  )();

  if (result._tag === "Left") {
    return NextResponse.json({ error: result.left }, { status: 400 });
  }

  return NextResponse.json(result.right, { status: 200 });
}
