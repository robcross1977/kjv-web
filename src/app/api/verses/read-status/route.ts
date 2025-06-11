import { NextRequest, NextResponse } from "next/server";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";

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

        // TODO: Query database for read status
        // For now, return empty array (all verses unread)
        return {
          userId: "demo-user", // Temporary demo user
          book,
          chapter: parseInt(chapter),
          verses,
          readVerses: [], // Will be populated from database
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
