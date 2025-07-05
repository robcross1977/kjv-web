import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

/**
 * Strong's concordance AI agent for looking up Hebrew and Greek word meanings
 * Uses AI to provide authentic Strong's concordance data
 */
const strongsAgent = new Agent({
  name: "Strong's Concordance Assistant",
  instructions: `You are a biblical language expert specializing in Strong's concordance data.

EXPERTISE:
- Hebrew (Old Testament) and Greek (New Testament) biblical languages
- Strong's numbering system (H1-H8674 for Hebrew, G1-G5624 for Greek)
- Original word meanings, transliterations, and usage patterns
- Biblical context and theological significance

RESPONSE FORMAT:
For each English word requested, provide:
1. Strong's number(s) that correspond to that English word
2. Original Hebrew/Greek word with proper characters
3. Accurate transliteration (pronunciation guide)
4. Primary definition and meaning
5. Usage context in biblical text
6. Number of occurrences in Scripture (if known)

ACCURACY REQUIREMENTS:
- Only provide authentic Strong's concordance data
- If you don't have exact Strong's data, clearly state limitations
- Focus on most common/significant uses of each word
- Distinguish between Old Testament (Hebrew) and New Testament (Greek) usage
- Be precise with Strong's numbers and transliterations

THEOLOGICAL PERSPECTIVE:
- Conservative, evangelical interpretation
- Respect for biblical inerrancy and authority
- Focus on original language meanings that support sound doctrine`,

  model: openai("gpt-4"), // Use full model for accuracy
  tools: {},
});

/**
 * Strong's concordance tool for looking up Hebrew and Greek word meanings
 * This provides authentic Strong's concordance data via AI agent
 */
export const strongsConcordanceTool = createTool({
  id: "strongs-concordance",
  description:
    "Look up authentic Strong's concordance data for Hebrew (Old Testament) and Greek (New Testament) Bible words. Provides original language meanings, transliterations, and usage context.",
  inputSchema: z.object({
    words: z
      .array(z.string())
      .describe("Array of English words to look up Strong's data for"),
    testament: z
      .enum(["old", "new", "both"])
      .describe(
        "Which testament to search in (old=Hebrew, new=Greek, both=all)"
      ),
    verse: z
      .string()
      .optional()
      .describe("Bible verse reference for context (e.g., 'John 3:16')"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        englishWord: z.string(),
        strongsEntries: z.array(
          z.object({
            strongsNumber: z.string(),
            originalWord: z.string(),
            transliteration: z.string(),
            definition: z.string(),
            usage: z.string(),
            occurrences: z.number().optional(),
            testament: z.enum(["old", "new"]),
          })
        ),
      })
    ),
    totalFound: z.number(),
    searchedWords: z.array(z.string()),
    limitations: z.string().optional(),
  }),
  execute: async (context) => {
    return lookupStrongsData(
      context.context.words,
      context.context.testament,
      context.context.verse
    );
  },
});

/**
 * Look up Strong's concordance data using AI agent
 */
async function lookupStrongsData(
  words: string[],
  testament: "old" | "new" | "both",
  verse?: string
): Promise<{
  results: Array<{
    englishWord: string;
    strongsEntries: Array<{
      strongsNumber: string;
      originalWord: string;
      transliteration: string;
      definition: string;
      usage: string;
      occurrences?: number;
      testament: "old" | "new";
    }>;
  }>;
  totalFound: number;
  searchedWords: string[];
  limitations?: string;
}> {
  try {
    console.log(
      "Strong's tool: Looking up words via AI:",
      words,
      "Testament:",
      testament
    );

    const testamentText =
      testament === "both"
        ? "both Old and New Testament"
        : testament === "old"
        ? "Old Testament (Hebrew)"
        : "New Testament (Greek)";

    const contextText = verse ? ` in the context of ${verse}` : "";

    const prompt = `Please provide Strong's concordance data for these English words: ${words.join(
      ", "
    )}

Search in: ${testamentText}${contextText}

For each word, provide:
1. Relevant Strong's number(s)
2. Original Hebrew/Greek word
3. Transliteration 
4. Definition and meaning
5. Biblical usage context
6. Approximate occurrences (if known)

Format as structured data that can be parsed. If you don't have complete Strong's data for any word, mention limitations.`;

    const response = await strongsAgent.generate(prompt);

    console.log("Strong's agent response:", response.text);

    // Parse AI response into structured format
    const results = parseStrongsResponse(response.text, words, testament);

    const totalFound = pipe(
      results,
      A.map((r) => r.strongsEntries.length),
      A.reduce(0, (acc, count) => acc + count)
    );

    console.log(
      "Strong's tool: Found",
      totalFound,
      "entries for",
      words.length,
      "words"
    );

    return {
      results,
      totalFound,
      searchedWords: words,
      limitations: extractLimitations(response.text),
    };
  } catch (error) {
    console.error("Strong's tool: Error looking up words:", error);

    // Return empty results on error
    return {
      results: words.map((word) => ({
        englishWord: word,
        strongsEntries: [],
      })),
      totalFound: 0,
      searchedWords: words,
      limitations: `Error occurred while looking up Strong's data: ${error}`,
    };
  }
}

/**
 * Parse AI response into structured Strong's data
 * This extracts Strong's numbers, words, and definitions from the AI response
 */
function parseStrongsResponse(
  response: string,
  words: string[],
  testament: "old" | "new" | "both"
): Array<{
  englishWord: string;
  strongsEntries: Array<{
    strongsNumber: string;
    originalWord: string;
    transliteration: string;
    definition: string;
    usage: string;
    occurrences?: number;
    testament: "old" | "new";
  }>;
}> {
  const results: Array<{
    englishWord: string;
    strongsEntries: Array<{
      strongsNumber: string;
      originalWord: string;
      transliteration: string;
      definition: string;
      usage: string;
      occurrences?: number;
      testament: "old" | "new";
    }>;
  }> = [];

  // Split response into numbered sections (1., 2., etc.)
  const sections = response.split(/\n\s*\d+\.\s+/).filter((s) => s.trim());

  for (const section of sections) {
    const entry = parseStrongsEntry(section);
    if (entry) {
      // Find which English word this entry belongs to
      const matchedWord = words.find(
        (word) =>
          section.toLowerCase().includes(word.toLowerCase()) ||
          entry.englishWord.toLowerCase().includes(word.toLowerCase())
      );

      if (matchedWord) {
        let existingResult = results.find((r) => r.englishWord === matchedWord);
        if (!existingResult) {
          existingResult = { englishWord: matchedWord, strongsEntries: [] };
          results.push(existingResult);
        }
        existingResult.strongsEntries.push(entry);
      }
    }
  }

  // Ensure all words have at least an empty entry
  for (const word of words) {
    if (!results.find((r) => r.englishWord === word)) {
      results.push({ englishWord: word, strongsEntries: [] });
    }
  }

  return results;
}

/**
 * Parse a single Strong's entry from the AI response
 */
function parseStrongsEntry(section: string): {
  strongsNumber: string;
  originalWord: string;
  transliteration: string;
  definition: string;
  usage: string;
  occurrences?: number;
  testament: "old" | "new";
  englishWord: string;
} | null {
  // Extract Strong's number
  const strongsMatch =
    section.match(/Strong's Number:\s*([HG]\d+)/i) ||
    section.match(/([HG]\d+)/);
  if (!strongsMatch) return null;

  const strongsNumber = strongsMatch[1];
  const isHebrew = strongsNumber.startsWith("H");
  const testament: "old" | "new" = isHebrew ? "old" : "new";

  // Extract original word (Hebrew/Greek characters)
  const originalWordMatch =
    section.match(/(?:Greek Word|Hebrew Word|Original Word):\s*([^\n]+)/i) ||
    section.match(/Word:\s*([^\n,]+)/i);
  let originalWord = originalWordMatch?.[1]?.trim() || "";

  // Also look for Unicode Hebrew/Greek characters
  if (!originalWord || originalWord === "Unknown") {
    const hebrewMatch = section.match(/([\u0590-\u05FF]+)/);
    const greekMatch = section.match(/([\u0370-\u03FF]+)/);
    originalWord = hebrewMatch?.[0] || greekMatch?.[0] || "Unknown";
  }

  // Extract transliteration
  const transliterationMatch =
    section.match(/(?:Transliteration|Pronunciation):\s*([^\n]+)/i) ||
    section.match(/\(([^)]+)\)/) ||
    section.match(/'([^']+)'/);
  const transliteration = transliterationMatch?.[1]?.trim() || "Unknown";

  // Extract definition
  const definitionMatch = section.match(/(?:Definition|Meaning):\s*([^\n]+)/i);
  let definition = definitionMatch?.[1]?.trim() || "";

  if (!definition) {
    // Look for definition after "Definition and Meaning:"
    const defMatch = section.match(/Definition and Meaning:\s*([^\n]+)/i);
    definition = defMatch?.[1]?.trim() || "No definition available";
  }

  // Extract usage/context
  const usageMatch = section.match(
    /(?:Usage|Biblical Usage|Context):\s*([^\n]+)/i
  );
  const usage = usageMatch?.[1]?.trim() || "General biblical usage";

  // Extract occurrences
  const occurrenceMatch = section.match(/(?:Occurrences?|Times?):\s*(\d+)/i);
  const occurrences = occurrenceMatch
    ? parseInt(occurrenceMatch[1])
    : undefined;

  // Extract English word (for matching)
  const englishWordMatch = section.match(/^([A-Za-z]+)/);
  const englishWord = englishWordMatch?.[1] || "";

  return {
    strongsNumber,
    originalWord,
    transliteration,
    definition,
    usage,
    occurrences,
    testament,
    englishWord,
  };
}

/**
 * Extract any limitations mentioned in the AI response
 */
function extractLimitations(response: string): string | undefined {
  // Look for any limitations mentioned in the response
  const limitationPattern = /(?:limitation|note|caveat|incomplete).*$/im;
  const match = response.match(limitationPattern);
  return match?.[0] || undefined;
}
