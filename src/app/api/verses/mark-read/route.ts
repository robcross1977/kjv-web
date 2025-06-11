import { NextRequest, NextResponse } from "next/server";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import { PrismaClient } from "@prisma/client";
import { auth0 } from "@/lib/auth0";

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
  const result = await pipe(
    TE.tryCatch(
      async () => {
        // Temporarily use demo user for testing
        // TODO: Re-enable authentication once Auth0 is working
        const userId = "demo-user";
        const body = (await request.json()) as MarkReadRequest;
        console.log("Request body:", body);

        if (!body.verses || !Array.isArray(body.verses)) {
          throw new Error("Missing or invalid verses array");
        }

        const action = body.action || "mark";

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

        // Ensure user exists
        await prisma.user.upsert({
          where: { uid: userId },
          update: {},
          create: {
            uid: userId,
            email: "demo@example.com",
            name: "Demo User",
          },
        });

        if (action === "mark") {
          // Mark verses as read (upsert to handle duplicates)
          await Promise.all(
            validVerses.map((verse) =>
              prisma.readVerse.upsert({
                where: {
                  userId_book_chapter_verse: {
                    userId,
                    book: verse.book,
                    chapter: verse.chapter,
                    verse: verse.verse,
                  },
                },
                update: {
                  readAt: new Date(),
                },
                create: {
                  userId,
                  book: verse.book,
                  chapter: verse.chapter,
                  verse: verse.verse,
                },
              })
            )
          );
        } else {
          // Unmark verses (delete from database)
          await prisma.readVerse.deleteMany({
            where: {
              userId,
              OR: validVerses.map((verse) => ({
                book: verse.book,
                chapter: verse.chapter,
                verse: verse.verse,
              })),
            },
          });
        }

        return {
          userId,
          action,
          processedCount: validVerses.length,
          verses: validVerses,
          timestamp: new Date().toISOString(),
        };
      },
      (error) => {
        console.error("API Error:", error);
        return `Error: ${error}`;
      }
    )
  )();

  if (result._tag === "Left") {
    return NextResponse.json({ error: result.left }, { status: 400 });
  }

  return NextResponse.json(result.right, { status: 200 });
}
