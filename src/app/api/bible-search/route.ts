import { NextRequest, NextResponse } from "next/server";
import { bibleSearchAgent } from "@/mastra/agents/bible-search-agent";
import { z } from "zod";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";

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
 * Bible search API endpoint
 *
 * Takes natural language queries about spiritual topics and returns relevant Bible references
 * Uses Mastra agent to convert queries to Bible references (frontend fetches verse text via kingjames)
 *
 * @param request - Contains query (spiritual question/topic) and optional limit
 * @returns Bible references that can be used with kingjames library
 */
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

    // Execute agent search
    const agentResponse = (await bibleSearchAgent.generate(
      [
        {
          role: "user",
          content: generatePrompt(query, limit),
        },
      ],
      { maxSteps: 3 }
    )) as AgentResponse;

    // Extract verses and context using functional approach
    const verses = extractAllVerses(agentResponse);
    const context = extractContext(agentResponse);
    const result = createSuccessResponse(verses, context, query, limit);

    return NextResponse.json(result);
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
