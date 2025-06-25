import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import * as Ord from "fp-ts/Ord";
import * as S from "fp-ts/string";
import { search, WrappedRecords } from "kingjames";

interface BibleVerse {
  reference: string;
  text: string;
  relevance: number;
}

/**
 * Bible search tool that takes Bible references and retrieves the actual verse text
 * Uses the kingjames package for verse retrieval only
 */
export const bibleSearchTool = createTool({
  id: "bible-search",
  description:
    "Retrieve Bible verses by reference using the KJV Bible. Takes specific Bible references (e.g., 'john 3:16', '1 corinthians 13:4-8') and returns the actual verse text.",
  inputSchema: z.object({
    references: z
      .array(z.string())
      .describe(
        'Array of Bible references in lowercase format (e.g., ["john 3:16", "1 corinthians 13:4-8", "psalms 23:1-6"])'
      ),
    limit: z
      .number()
      .min(1)
      .max(20)
      .default(10)
      .describe("Maximum number of verses to return across all references"),
  }),
  outputSchema: z.object({
    verses: z.array(
      z.object({
        reference: z.string().describe('Bible reference (e.g., "John 3:16")'),
        relevance: z
          .number()
          .min(0)
          .max(1)
          .describe("Relevance score (1.0 for exact matches)"),
      })
    ),
    totalFound: z.number().describe("Total number of verses found"),
    searchedReferences: z
      .array(z.string())
      .describe("The original references that were searched"),
  }),
  execute: async (context, _options) => {
    return fetchBibleVerses(context.context.references, context.context.limit);
  },
});

/**
 * Fetch Bible verses using specific Bible references
 * Uses the kingjames package to retrieve verse text by reference
 */
async function fetchBibleVerses(
  references: string[],
  limit: number
): Promise<{
  verses: BibleVerse[];
  totalFound: number;
  searchedReferences: string[];
}> {
  try {
    console.log(
      "Bible search tool: Fetching verses for references:",
      references
    );

    // Fetch verses for each reference
    const allVerses: BibleVerse[] = [];

    for (const reference of references) {
      try {
        console.log("Bible search tool: Processing reference:", reference);

        // Use kingjames search to get verses for this reference
        const searchResults: WrappedRecords = search(reference.toLowerCase());

        console.log(
          "Bible search tool: Raw results for",
          reference,
          ":",
          searchResults
        );

        // Convert WrappedRecords to flat array of verses
        const verses: BibleVerse[] = pipe(
          searchResults.records,
          R.toArray,
          A.chain(([bookName, chapters]) =>
            pipe(
              chapters,
              R.toArray,
              A.chain(([chapterNum, verses]) =>
                pipe(
                  verses,
                  R.toArray,
                  A.map(
                    ([verseNum, verseText]): BibleVerse => ({
                      reference: `${capitalizeBookName(
                        bookName
                      )} ${chapterNum}:${verseNum}`,
                      text: verseText,
                      relevance: 1.0, // All fetched verses are exact matches
                    })
                  )
                )
              )
            )
          )
        );

        allVerses.push(...verses);
        console.log(
          "Bible search tool: Found",
          verses.length,
          "verses for reference:",
          reference
        );
      } catch (error) {
        console.error(
          "Bible search tool: Error processing reference",
          reference,
          ":",
          error
        );
        // Continue with other references even if one fails
      }
    }

    // Sort verses by reference order and limit results
    const sortedVerses = pipe(
      allVerses,
      // Sort by reference string (alphabetical order)
      A.sort(Ord.contramap((verse: BibleVerse) => verse.reference)(S.Ord)),
      // Take only the requested limit
      A.takeLeft(limit)
    );

    const result = {
      verses: sortedVerses,
      totalFound: sortedVerses.length,
      searchedReferences: references,
    };

    console.log("Bible search tool: Final result:", result);
    return result;
  } catch (error) {
    console.error("Bible search tool: Error fetching verses:", error);

    // Return empty results if search fails
    return {
      verses: [],
      totalFound: 0,
      searchedReferences: references,
    };
  }
}

/**
 * Capitalize book names for proper display
 */
function capitalizeBookName(bookName: string): string {
  return bookName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
