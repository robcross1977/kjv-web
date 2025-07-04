import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/bookmark-auth";
import prisma from "@/lib/prisma";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { z } from "zod";
import { ValidBookName, chapterCountFrom, verseCountFrom } from "kingjames";
import { BIBLE_BOOKS } from "@/lib/bible-stats";

// Request validation schema
const MarkBookReadSchema = z.object({
  book: z
    .string()
    .refine(
      (book): book is ValidBookName =>
        BIBLE_BOOKS.includes(book as ValidBookName),
      "Invalid book name"
    ),
  action: z.enum(["mark_read", "mark_unread"]),
});

/**
 * POST /api/verses/mark-book-read
 * Mark all verses in a book as read or unread
 */
export async function POST(request: NextRequest) {
  const result = await pipe(
    getAuthenticatedUserId(request),
    TE.chain((userId) =>
      pipe(
        TE.tryCatch(
          () => request.json(),
          (error) => `Failed to parse request body: ${error}`
        ),
        TE.chainEitherK((body) =>
          pipe(
            MarkBookReadSchema.safeParse(body),
            E.fromPredicate(
              (result) => result.success,
              (result) =>
                result.success
                  ? ""
                  : result.error.issues.map((i) => i.message).join(", ")
            ),
            E.map((result) => result.data)
          )
        ),
        TE.chain(({ book, action }) =>
          TE.tryCatch(
            async () => {
              if (action === "mark_read") {
                // Get all verses in the book
                const allVerses: Array<{
                  book: string;
                  chapter: number;
                  verse: number;
                }> = [];
                const chapterCount = chapterCountFrom(book);

                for (let chapter = 1; chapter <= chapterCount; chapter++) {
                  const verseCountOption = verseCountFrom(book, chapter);
                  if (verseCountOption._tag === "Some") {
                    const verseCount = verseCountOption.value;
                    for (let verse = 1; verse <= verseCount; verse++) {
                      allVerses.push({ book, chapter, verse });
                    }
                  }
                }

                // Use upsert to mark all verses as read
                await Promise.all(
                  allVerses.map(({ book, chapter, verse }) =>
                    prisma.readVerse.upsert({
                      where: {
                        userId_book_chapter_verse: {
                          userId,
                          book,
                          chapter,
                          verse,
                        },
                      },
                      update: {
                        readAt: new Date(),
                      },
                      create: {
                        userId,
                        book,
                        chapter,
                        verse,
                        readAt: new Date(),
                      },
                    })
                  )
                );

                return {
                  success: true,
                  message: `Marked all verses in ${book} as read`,
                  versesMarked: allVerses.length,
                  book,
                  action,
                };
              } else {
                // Mark all verses in book as unread (delete them)
                const deleteResult = await prisma.readVerse.deleteMany({
                  where: {
                    userId,
                    book,
                  },
                });

                return {
                  success: true,
                  message: `Marked all verses in ${book} as unread`,
                  versesUnmarked: deleteResult.count,
                  book,
                  action,
                };
              }
            },
            (error) => `Database operation failed: ${String(error)}`
          )
        )
      )
    )
  )();

  if (E.isLeft(result)) {
    return NextResponse.json({ error: result.left }, { status: 500 });
  }

  return NextResponse.json(result.right);
}
