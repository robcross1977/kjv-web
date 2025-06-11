import { NextRequest, NextResponse } from "next/server";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";

type VerseReference = {
  book: string;
  chapter: number;
  verse: number;
};

type MarkReadRequest = {
  verses: VerseReference[];
};

/**
 * POST /api/verses/mark-read
 *
 * Body: { verses: [{ book, chapter, verse }] }
 *
 * Marks the specified verses as read for the authenticated user
 */
export async function POST(request: NextRequest) {
  const result = await pipe(
    TE.tryCatch(
      async () => {
        const body = (await request.json()) as MarkReadRequest;

        if (!body.verses || !Array.isArray(body.verses)) {
          throw new Error("Missing or invalid verses array");
        }

        const validVerses = pipe(
          body.verses,
          A.filter(
            (v): v is VerseReference =>
              typeof v.book === "string" &&
              typeof v.chapter === "number" &&
              typeof v.verse === "number" &&
              v.book.length > 0 &&
              v.chapter > 0 &&
              v.verse > 0
          )
        );

        if (validVerses.length === 0) {
          throw new Error("No valid verses provided");
        }

        // TODO: Save to database
        // For now, just return success
        return {
          userId: "demo-user", // Temporary demo user
          markedCount: validVerses.length,
          verses: validVerses,
          timestamp: new Date().toISOString(),
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
