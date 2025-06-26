import { NextRequest, NextResponse } from "next/server";
import { bibleSearchAgent } from "@/mastra/agents/bible-search-agent";
import { z } from "zod";

// Input validation schema
const BibleSearchSchema = z.object({
  query: z.string().min(1, "Query is required").max(500, "Query too long"),
  limit: z.number().min(1).max(50).optional().default(20),
});

/**
 * Bible search API endpoint
 *
 * Takes natural language queries about spiritual topics and returns relevant Bible references
 * Uses Mastra agent to convert queries to Bible references (frontend fetches verse text via kingjames)
 *
 * @param request - Contains query (spiritual question/topic) and optional limit
 * @returns Bible references that can be used with kingjames library
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Bible search API: Received request:", body);

    // Validate input
    const validatedInput = BibleSearchSchema.parse(body);
    const { query, limit } = validatedInput;

    console.log(
      "Bible search API: Processing query:",
      query,
      "with limit:",
      limit
    );

    // Use Mastra agent to process the spiritual query
    // The agent will:
    // 1. Understand the spiritual topic/question
    // 2. Generate relevant Bible references
    // Frontend will use kingjames library to fetch actual verse text
    const response = await bibleSearchAgent.generate(
      [
        {
          role: "user",
          content: `I need help finding Bible verses about: "${query}". Please find the most relevant verses that address this topic or question. Limit the results to ${limit} verses total.`,
        },
      ],
      {
        maxSteps: 3, // Allow the agent to use tools
      }
    );

    console.log("Bible search API: Agent response:", response);

    // Extract verses from tool results (including text)
    const verses: Array<{
      reference: string;
      text: string;
      relevance: number;
    }> = [];

    // Look through tool results to find verse data
    console.log("Bible search API: Total steps:", response.steps.length);
    for (let i = 0; i < response.steps.length; i++) {
      const step = response.steps[i];
      console.log(`Bible search API: Step ${i} type:`, step.stepType);
      console.log(
        `Bible search API: Step ${i} toolResults:`,
        step.toolResults?.length || 0
      );

      if (step.toolResults) {
        for (let j = 0; j < step.toolResults.length; j++) {
          const toolResult = step.toolResults[j];
          console.log(
            `Bible search API: Tool result ${j} type:`,
            typeof toolResult.result
          );
          console.log(
            `Bible search API: Tool result ${j} content:`,
            toolResult.result
          );

          // Handle both string and object results
          let parsedResult: any;
          if (typeof toolResult.result === "string") {
            try {
              parsedResult = JSON.parse(toolResult.result);
            } catch (e) {
              console.log(
                "Bible search API: Tool result not JSON:",
                toolResult.result
              );
              continue;
            }
          } else if (typeof toolResult.result === "object") {
            parsedResult = toolResult.result;
          } else {
            continue;
          }

          console.log("Bible search API: Parsed tool result:", parsedResult);

          if (parsedResult.verses && Array.isArray(parsedResult.verses)) {
            verses.push(
              ...parsedResult.verses.map((v: any) => ({
                reference: v.reference,
                text: v.text,
                relevance: v.relevance || 1,
              }))
            );
          }
        }
      }
    }

    console.log("Bible search API: Extracted verses:", verses);

    // Return in the format expected by frontend components
    const result = {
      verses: verses.slice(0, limit), // Respect the limit
      context: response.text.split("\n\n").pop() || response.text, // Use the last paragraph as context
      query,
    };

    console.log("Bible search API: Final response:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Bible search API error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search Bible verses",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
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
