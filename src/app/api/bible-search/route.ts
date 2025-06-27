import { NextRequest, NextResponse } from "next/server";
import { bibleSearchAgent } from "@/mastra/agents/bible-search-agent";
import { z } from "zod";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { search } from "kingjames";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";

// Input validation schema
const BibleSearchSchema = z.object({
  query: z.string().min(1, "Query is required").max(500, "Query too long"),
  limit: z.number().min(1).max(50).optional().default(20),
});

// Types
type MastraVerse = {
  reference: string;
  text: string;
  relevance: number;
};

type ToolResult = {
  result: unknown;
};

type Step = {
  stepType: string;
  toolResults?: ToolResult[];
};

type AgentResponse = {
  text: string;
  steps: Step[];
};

// Timeout configuration for Vercel
const AGENT_TIMEOUT_MS = 270000; // 4.5 minutes to allow AI processing time while leaving buffer for 5min limit

/**
 * Common Bible references for popular topics (fallback when agent times out)
 */
const COMMON_REFERENCES: Record<string, string[]> = {
  love: ["john 3:16", "1 john 4:8", "1 corinthians 13:4-8", "romans 8:38-39"],
  forgiveness: [
    "matthew 6:14-15",
    "ephesians 4:32",
    "1 john 1:9",
    "colossians 3:13",
  ],
  hope: ["romans 15:13", "jeremiah 29:11", "psalms 42:11", "hebrews 11:1"],
  peace: ["john 14:27", "philippians 4:6-7", "isaiah 26:3", "romans 12:18"],
  strength: [
    "philippians 4:13",
    "isaiah 40:31",
    "2 corinthians 12:9",
    "psalms 46:1",
  ],
  wisdom: ["proverbs 3:5-6", "james 1:5", "proverbs 9:10", "ecclesiastes 3:1"],
  faith: ["hebrews 11:6", "romans 10:17", "matthew 17:20", "ephesians 2:8-9"],
  comfort: [
    "2 corinthians 1:3-4",
    "psalms 23:1-6",
    "matthew 11:28-30",
    "revelation 21:4",
  ],
  anxiety: [
    "philippians 4:6-7",
    "matthew 6:25-26",
    "1 peter 5:7",
    "psalms 55:22",
  ],
  fear: ["joshua 1:9", "psalms 23:4", "isaiah 41:10", "2 timothy 1:7"],
  prayer: [
    "matthew 6:9-13",
    "1 thessalonians 5:17",
    "james 5:16",
    "philippians 4:6",
  ],
  salvation: ["romans 10:9", "ephesians 2:8-9", "john 14:6", "acts 4:12"],
};

/**
 * Timeout wrapper for agent calls
 */
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = "Operation timed out"
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
};

/**
 * Fallback search using common references
 */
const fallbackSearch = (query: string, limit: number): MastraVerse[] => {
  const queryLower = query.toLowerCase();

  // Find matching topics
  const matchingRefs = pipe(
    Object.entries(COMMON_REFERENCES),
    A.filter(
      ([topic]) => queryLower.includes(topic) || topic.includes(queryLower)
    ),
    A.chain(([, refs]) => refs),
    A.takeLeft(limit)
  );

  // If no topic matches, use a general set of popular verses
  const refsToUse =
    matchingRefs.length > 0
      ? matchingRefs
      : [
          "john 3:16",
          "psalms 23:1-6",
          "philippians 4:13",
          "romans 8:28",
          "jeremiah 29:11",
        ];

  return pipe(
    refsToUse,
    A.map((ref) => {
      try {
        const searchResults = search(ref);
        return pipe(
          Object.entries(searchResults.records),
          A.chain(([bookName, chapters]) =>
            pipe(
              Object.entries(
                chapters as Record<string, Record<string, string>>
              ),
              A.chain(([chapterNum, verses]) =>
                pipe(
                  Object.entries(verses),
                  A.map(
                    ([verseNum, verseText]): MastraVerse => ({
                      reference: `${capitalizeFirstAlphabeticCharacter(
                        bookName
                      )} ${chapterNum}:${verseNum}`,
                      text: verseText as string,
                      relevance: 0.8, // Lower relevance for fallback
                    })
                  )
                )
              )
            )
          )
        );
      } catch {
        return [];
      }
    }),
    A.flatten,
    A.takeLeft(limit)
  );
};

/**
 * Parse tool result to extract verse data
 */
const parseToolResult = (toolResult: ToolResult): O.Option<MastraVerse[]> =>
  pipe(
    toolResult.result,
    O.fromNullable,
    O.chain((result) => {
      if (typeof result === "string") {
        return pipe(
          E.tryCatch(
            () => JSON.parse(result),
            () => "Parse error"
          ),
          E.fold(
            () => O.none,
            (parsed) => O.some(parsed)
          )
        );
      }
      return typeof result === "object" ? O.some(result) : O.none;
    }),
    O.chain((parsed: any) =>
      parsed?.verses && Array.isArray(parsed.verses)
        ? O.some(
            pipe(
              parsed.verses,
              A.map((v: any) => ({
                reference: v.reference,
                text: v.text,
                relevance: v.relevance || 1,
              }))
            )
          )
        : O.none
    )
  );

/**
 * Extract verses from all tool results in a step
 */
const extractVersesFromStep = (step: Step): MastraVerse[] =>
  pipe(
    step.toolResults,
    O.fromNullable,
    O.fold(
      () => [],
      (toolResults) =>
        pipe(toolResults, A.filterMap(parseToolResult), A.flatten)
    )
  );

/**
 * Extract all verses from agent response steps
 */
const extractAllVerses = (response: AgentResponse): MastraVerse[] =>
  pipe(response.steps, A.map(extractVersesFromStep), A.flatten);

/**
 * Extract context from agent response text
 */
const extractContext = (response: AgentResponse): string =>
  pipe(
    response.text.split("\n\n"),
    A.last,
    O.getOrElse(() => response.text)
  );

/**
 * Generate agent prompt for spiritual query
 */
const generatePrompt = (query: string, limit: number): string =>
  `I need help finding Bible verses about: "${query}". Please find the most relevant verses that address this topic or question. Limit the results to ${limit} verses total.`;

/**
 * Validate request body using Zod schema
 */
const validateRequestBody = (
  body: unknown
): E.Either<z.ZodError, { query: string; limit: number }> =>
  E.tryCatch(
    () => BibleSearchSchema.parse(body),
    (error) => error as z.ZodError
  );

/**
 * Create success response
 */
const createSuccessResponse = (
  verses: MastraVerse[],
  context: string,
  query: string,
  limit: number
) => ({
  verses: verses.slice(0, limit),
  context,
  query,
});

/**
 * Handle validation errors
 */
const handleValidationError = (error: z.ZodError): NextResponse =>
  NextResponse.json(
    {
      success: false,
      error: "Invalid input",
      details: error.errors,
    },
    { status: 400 }
  );

/**
 * Handle general errors
 */
const handleGeneralError = (error: Error): NextResponse => {
  console.error("Bible search API error:", error);
  return NextResponse.json(
    {
      success: false,
      error: "Failed to search Bible verses",
      message: error.message,
    },
    { status: 500 }
  );
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const requestBody = await request.json();

    // Validate input using functional approach
    const validationResult = validateRequestBody(requestBody);

    if (E.isLeft(validationResult)) {
      return handleValidationError(validationResult.left);
    }

    const { query, limit } = validationResult.right;

    let verses: MastraVerse[] = [];
    let context = "";
    let usedFallback = false;

    try {
      // Execute agent search with timeout
      const agentResponse = (await withTimeout(
        bibleSearchAgent.generate(
          [
            {
              role: "user",
              content: generatePrompt(query, limit),
            },
          ],
          { maxSteps: 3 } // Allow more steps for better AI responses
        ),
        AGENT_TIMEOUT_MS,
        "Agent search timed out"
      )) as AgentResponse;

      // Extract verses and context using functional approach
      verses = extractAllVerses(agentResponse);
      context = extractContext(agentResponse);
    } catch (error) {
      console.warn("Agent search failed or timed out, using fallback:", error);

      // Use fallback search for common topics
      verses = fallbackSearch(query, limit);
      context = `Found ${verses.length} verses using fallback search. The AI search timed out, but here are relevant verses for your query.`;
      usedFallback = true;
    }

    const result = createSuccessResponse(verses, context, query, limit);

    // Add metadata about fallback usage
    const resultWithMetadata = {
      ...result,
      usedFallback,
      responseTime: usedFallback ? "fast" : "normal",
    };

    return NextResponse.json(resultWithMetadata);
  } catch (error) {
    return handleGeneralError(
      error instanceof Error ? error : new Error("Unknown error")
    );
  }
}

/**
 * Handle GET requests for testing
 */
export async function GET() {
  return NextResponse.json({
    message: "Bible Search API",
    description:
      "POST to this endpoint with a query to search for Bible verses",
    usage: {
      method: "POST",
      body: {
        query:
          'string (required) - Spiritual question or topic (e.g., "love", "forgiveness", "dealing with anxiety")',
        limit:
          "number (optional) - Maximum verses to return (1-50, default: 20)",
      },
    },
    examples: [
      {
        query: "verses about love",
        limit: 10,
      },
      {
        query: "comfort during difficult times",
        limit: 15,
      },
      {
        query: "what does the Bible say about forgiveness?",
        limit: 20,
      },
    ],
  });
}
