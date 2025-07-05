import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as Ord from "fp-ts/Ord";
import * as N from "fp-ts/number";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

/**
 * Cross-reference AI agent for finding related Bible verses
 * Uses AI to provide authentic biblical cross-references
 */
const crossRefAgent = new Agent({
  name: "Biblical Cross-Reference Assistant",
  instructions: `You are a biblical scholar specializing in cross-references and thematic connections between Bible verses.

EXPERTISE:
- Comprehensive knowledge of biblical text and themes
- Understanding of doctrinal connections across Scripture
- Ability to identify parallel passages, prophetic fulfillments, and thematic links
- Knowledge of both Old and New Testament relationships

RESPONSE FORMAT:
For each verse or topic requested, provide:
1. Related Bible verses with full references (Book Chapter:Verse)
2. Type of relationship (parallel, fulfillment, theme, context, etc.)
3. Brief explanation of the connection
4. Relevance score (1-10) indicating strength of connection

RELATIONSHIP TYPES:
- Parallel: Similar wording or identical accounts
- Fulfillment: Prophecy and its fulfillment
- Theme: Same theological theme or concept
- Context: Historical or narrative context
- Contrast: Opposing or contrasting concepts
- Application: Practical application of principles
- Etymology: Word studies and original language connections

ACCURACY REQUIREMENTS:
- Only provide authentic biblical cross-references
- Verify verse references are accurate (correct book, chapter, verse)
- Focus on theologically sound connections
- Distinguish between Old Testament and New Testament relationships
- Prioritize the most relevant and significant connections

THEOLOGICAL PERSPECTIVE:
- Conservative, evangelical interpretation
- Respect for biblical inerrancy and authority
- Independent Baptist theological framework when applicable
- Focus on practical application and spiritual growth`,

  model: openai("gpt-4"), // Use full model for accuracy
  tools: {},
});

/**
 * Cross-reference tool for finding related Bible verses and thematic connections
 * This provides authentic biblical cross-references via AI agent
 */
export const crossReferenceTool = createTool({
  id: "bible-cross-reference",
  description:
    "Find authentic biblical cross-references and related verses for any Bible passage or topic. Provides verse connections, thematic links, and explanations of relationships.",
  inputSchema: z.object({
    verse: z
      .string()
      .describe(
        "Bible verse reference (e.g., 'John 3:16') or topic to find cross-references for"
      ),
    maxResults: z
      .number()
      .min(1)
      .max(20)
      .default(10)
      .describe("Maximum number of cross-references to return"),
    relationshipTypes: z
      .array(
        z.enum([
          "parallel",
          "fulfillment",
          "theme",
          "context",
          "contrast",
          "application",
          "etymology",
        ])
      )
      .optional()
      .describe("Types of relationships to focus on"),
    testament: z
      .enum(["old", "new", "both"])
      .default("both")
      .describe("Which testament to search in"),
  }),
  outputSchema: z.object({
    sourceVerse: z.string(),
    crossReferences: z.array(
      z.object({
        verse: z.string(),
        reference: z.string(),
        relationshipType: z.string(),
        explanation: z.string(),
        relevanceScore: z.number().min(1).max(10),
        testament: z.enum(["old", "new"]),
      })
    ),
    totalFound: z.number(),
    searchQuery: z.string(),
    limitations: z.string().optional(),
  }),
  execute: async (context) => {
    return findCrossReferences(
      context.context.verse,
      context.context.maxResults,
      context.context.relationshipTypes,
      context.context.testament
    );
  },
});

/**
 * Find biblical cross-references using AI agent
 */
async function findCrossReferences(
  verse: string,
  maxResults: number,
  relationshipTypes?: string[],
  testament: "old" | "new" | "both" = "both"
): Promise<{
  sourceVerse: string;
  crossReferences: Array<{
    verse: string;
    reference: string;
    relationshipType: string;
    explanation: string;
    relevanceScore: number;
    testament: "old" | "new";
  }>;
  totalFound: number;
  searchQuery: string;
  limitations?: string;
}> {
  try {
    console.log(
      "Cross-reference tool: Finding references for:",
      verse,
      "Max:",
      maxResults
    );

    const testamentText =
      testament === "both"
        ? "both Old and New Testament"
        : testament === "old"
        ? "Old Testament only"
        : "New Testament only";

    const relationshipText = relationshipTypes?.length
      ? ` Focus on these relationship types: ${relationshipTypes.join(", ")}.`
      : "";

    const prompt = `Please find biblical cross-references for: ${verse}

Search parameters:
- Maximum results: ${maxResults}
- Testament scope: ${testamentText}${relationshipText}

For each cross-reference, provide:
1. Full verse reference (Book Chapter:Verse)
2. Relationship type (parallel, fulfillment, theme, context, contrast, application, etymology)
3. Clear explanation of the connection
4. Relevance score (1-10, where 10 is most relevant)
5. Testament (old/new)

Format as structured data that can be parsed. Prioritize the most theologically significant and accurate connections.`;

    const response = await crossRefAgent.generate(prompt);

    console.log("Cross-reference agent response:", response.text);

    // Parse AI response into structured format
    const crossReferences = parseCrossReferenceResponse(
      response.text,
      testament
    );

    // Sort by relevance score (highest first) and limit results
    const byRelevanceScore = Ord.contramap(
      (ref: { relevanceScore: number }) => ref.relevanceScore
    )(Ord.reverse(N.Ord));
    const sortedRefs = pipe(crossReferences, A.sort(byRelevanceScore)).slice(
      0,
      maxResults
    );

    console.log(
      "Cross-reference tool: Found",
      sortedRefs.length,
      "references for",
      verse
    );

    return {
      sourceVerse: verse,
      crossReferences: sortedRefs,
      totalFound: sortedRefs.length,
      searchQuery: verse,
      limitations: extractLimitations(response.text),
    };
  } catch (error) {
    console.error("Cross-reference tool: Error finding references:", error);

    // Return empty results on error
    return {
      sourceVerse: verse,
      crossReferences: [],
      totalFound: 0,
      searchQuery: verse,
      limitations: `Error occurred while finding cross-references: ${error}`,
    };
  }
}

/**
 * Parse AI response into structured cross-reference data
 * This extracts verse references, relationships, and explanations from the AI response
 */
function parseCrossReferenceResponse(
  response: string,
  testament: "old" | "new" | "both"
): Array<{
  verse: string;
  reference: string;
  relationshipType: string;
  explanation: string;
  relevanceScore: number;
  testament: "old" | "new";
}> {
  const crossReferences: Array<{
    verse: string;
    reference: string;
    relationshipType: string;
    explanation: string;
    relevanceScore: number;
    testament: "old" | "new";
  }> = [];

  // Split response into lines for parsing
  const lines = response.split("\n");

  // Look for verse references (Book Chapter:Verse format)
  const versePattern = /([1-3]?\s*[A-Za-z]+)\s+(\d+):(\d+)/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const verseMatches = line.match(versePattern);

    if (verseMatches) {
      for (const verseMatch of verseMatches) {
        const reference = verseMatch.trim();

        // Determine testament based on book
        const testamentType = determineTestament(reference);

        // Skip if testament filter doesn't match
        if (testament !== "both" && testament !== testamentType) {
          continue;
        }

        // Extract additional data from surrounding lines
        const relationshipType = extractRelationshipType(response, reference);
        const explanation = extractExplanation(response, reference);
        const relevanceScore = extractRelevanceScore(response, reference);

        crossReferences.push({
          verse: reference,
          reference: reference,
          relationshipType,
          explanation,
          relevanceScore,
          testament: testamentType,
        });
      }
    }
  }

  return crossReferences;
}

/**
 * Determine testament based on book name
 */
function determineTestament(reference: string): "old" | "new" {
  const newTestamentBooks = [
    "Matthew",
    "Matt",
    "Mt",
    "Mark",
    "Mk",
    "Luke",
    "Lk",
    "John",
    "Jn",
    "Acts",
    "Romans",
    "Rom",
    "1 Corinthians",
    "1 Cor",
    "2 Corinthians",
    "2 Cor",
    "Galatians",
    "Gal",
    "Ephesians",
    "Eph",
    "Philippians",
    "Phil",
    "Colossians",
    "Col",
    "1 Thessalonians",
    "1 Thess",
    "2 Thessalonians",
    "2 Thess",
    "1 Timothy",
    "1 Tim",
    "2 Timothy",
    "2 Tim",
    "Titus",
    "Philemon",
    "Phlm",
    "Hebrews",
    "Heb",
    "James",
    "Jas",
    "1 Peter",
    "1 Pet",
    "2 Peter",
    "2 Pet",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation",
    "Rev",
  ];

  const bookName = reference.split(/\s+\d/)[0].trim();

  for (const ntBook of newTestamentBooks) {
    if (
      bookName.toLowerCase().includes(ntBook.toLowerCase()) ||
      ntBook.toLowerCase().includes(bookName.toLowerCase())
    ) {
      return "new";
    }
  }

  return "old";
}

/**
 * Extract relationship type from AI response
 */
function extractRelationshipType(response: string, reference: string): string {
  const relationshipTypes = [
    "parallel",
    "fulfillment",
    "theme",
    "context",
    "contrast",
    "application",
    "etymology",
  ];

  // Find the section containing this reference
  const lines = response.split("\n");
  let contextLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(reference)) {
      // Get surrounding context
      contextLines = lines.slice(
        Math.max(0, i - 2),
        Math.min(lines.length, i + 3)
      );
      break;
    }
  }

  const context = contextLines.join(" ").toLowerCase();

  // Look for relationship type keywords
  for (const type of relationshipTypes) {
    if (context.includes(type)) {
      return type;
    }
  }

  return "theme"; // Default fallback
}

/**
 * Extract explanation for the cross-reference
 */
function extractExplanation(response: string, reference: string): string {
  const lines = response.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(reference)) {
      // Look for explanation in the same line or next few lines
      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
        const line = lines[j];
        if (
          line.includes("explanation") ||
          line.includes("because") ||
          line.includes("connection")
        ) {
          return line
            .replace(/.*?(?:explanation|because|connection):?\s*/i, "")
            .trim();
        }
      }
      // Fallback: use the line containing the reference
      return lines[i].replace(reference, "").trim() || "Related passage";
    }
  }

  return "Related biblical passage";
}

/**
 * Extract relevance score from AI response
 */
function extractRelevanceScore(response: string, reference: string): number {
  const lines = response.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(reference)) {
      // Look for score pattern in surrounding lines
      const contextLines = lines.slice(
        Math.max(0, i - 1),
        Math.min(lines.length, i + 2)
      );
      const context = contextLines.join(" ");

      // Look for score patterns
      const scorePattern = /(?:score|relevance|rating):?\s*(\d+)/i;
      const match = context.match(scorePattern);

      if (match) {
        const score = parseInt(match[1]);
        return Math.min(Math.max(score, 1), 10); // Clamp between 1-10
      }
    }
  }

  return 7; // Default relevance score
}

/**
 * Extract any limitations mentioned in the AI response
 */
function extractLimitations(response: string): string | undefined {
  const limitationPatterns = [
    /limitations?:?\s*(.+)/i,
    /note:?\s*(.+)/i,
    /disclaimer:?\s*(.+)/i,
    /(?:limited|incomplete|partial).+/i,
  ];

  for (const pattern of limitationPatterns) {
    const match = response.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return undefined;
}
