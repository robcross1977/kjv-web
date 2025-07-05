import { NextRequest, NextResponse } from "next/server";
import { commentaryAgent } from "../../../mastra/agents/commentary-agent";
import {
  getChapterCommentary,
  saveChapterCommentary,
  getVerseCommentary,
  saveVerseCommentary,
} from "../../../lib/commentary-db";
import {
  CommentaryRequestSchema,
  ChapterCommentaryAiSchema,
  VerseCommentaryAiSchema,
} from "../../../types/commentary";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { z } from "zod";

export const maxDuration = 60;

// Type helpers for commentary data
type ChapterCommentaryData = z.infer<typeof ChapterCommentaryAiSchema>;
type VerseCommentaryData = z.infer<typeof VerseCommentaryAiSchema>;

/**
 * Try to parse JSON from AI response, handling various formats
 */
function tryParseCommentaryJson<T>(
  jsonString: string,
  schema: z.ZodSchema<T>
): T | null {
  try {
    // Try parsing the string directly first
    let parsed = JSON.parse(jsonString);
    const validated = schema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }

    // Try extracting JSON from markdown code blocks
    const match = jsonString.match(/```json\n([\s\S]*?)\n```/);
    if (match) {
      parsed = JSON.parse(match[1]);
      const validated = schema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      }
    }

    // Try extracting any JSON object from the text
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
      const validated = schema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to parse JSON response from AI:", error);
    return null;
  }
}

/**
 * GET /api/commentary - Get commentary for a chapter or verse
 * Query params: book, chapter, verse (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const bookQuery = searchParams.get("book");
    const chapterQuery = searchParams.get("chapter");
    const verseQuery = searchParams.get("verse");

    const paramsToValidate: {
      book: string | null;
      chapter: string | null;
      verse?: string | null;
    } = { book: bookQuery, chapter: chapterQuery };

    if (verseQuery) {
      paramsToValidate.verse = verseQuery;
    }

    const validation = CommentaryRequestSchema.safeParse(paramsToValidate);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { book, chapter, verse } = validation.data;

    if (verse) {
      return await handleGetVerseCommentary(book, chapter, verse);
    } else {
      return await handleGetChapterCommentary(book, chapter);
    }
  } catch (error) {
    console.error("API Commentary Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/commentary - Generate and stream commentary
 * Body: { book, chapter, verse? } OR { prompt, book, chapter, verse? } (useCompletion format)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle useCompletion format which sends { prompt: "...", ...otherFields }
    let validationData;
    if (body.prompt && (body.book || body.chapter || body.verse)) {
      // useCompletion format - extract the actual parameters from the body
      validationData = {
        book: body.book,
        chapter: body.chapter,
        verse: body.verse,
      };
    } else {
      // Original format
      validationData = body;
    }

    const validation = CommentaryRequestSchema.safeParse(validationData);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { book, chapter, verse } = validation.data;

    // Check cache first and return cached content if available
    if (verse) {
      const existingCommentary = await getVerseCommentary(
        book,
        chapter,
        verse
      )();
      if (E.isRight(existingCommentary) && O.isSome(existingCommentary.right)) {
        const cached = existingCommentary.right.value;
        return new Response(JSON.stringify(cached), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
      return await handlePostVerseCommentary(book, chapter, verse);
    } else {
      const existingCommentary = await getChapterCommentary(book, chapter)();
      if (E.isRight(existingCommentary) && O.isSome(existingCommentary.right)) {
        const cached = existingCommentary.right.value;
        return new Response(JSON.stringify(cached), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
      return await handlePostChapterCommentary(book, chapter);
    }
  } catch (error) {
    console.error("POST Commentary Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleGetChapterCommentary(book: string, chapter: number) {
  const existingCommentary = await getChapterCommentary(book, chapter)();
  if (E.isRight(existingCommentary) && O.isSome(existingCommentary.right)) {
    return NextResponse.json({
      cached: true,
      ...existingCommentary.right.value,
    });
  }
  return NextResponse.json({ cached: false });
}

async function handleGetVerseCommentary(
  book: string,
  chapter: number,
  verse: number
) {
  const existingCommentary = await getVerseCommentary(book, chapter, verse)();
  if (E.isRight(existingCommentary) && O.isSome(existingCommentary.right)) {
    return NextResponse.json({
      cached: true,
      ...existingCommentary.right.value,
    });
  }
  return NextResponse.json({ cached: false });
}

async function handlePostChapterCommentary(book: string, chapter: number) {
  const prompt = `Provide chapter commentary for ${book} ${chapter}. Return ONLY a valid JSON object with this exact structure: {"context": "...", "speaker": "...", "topics": [...], "culture": "...", "history": "...", "commentary": "..."}. Include context, speaker, topics, culture, and history.`;

  try {
    // Generate commentary using Mastra agent
    const response = await commentaryAgent.generate([
      {
        role: "user",
        content: prompt,
      },
    ]);

    const text = response.text;

    // Try to parse and save the commentary
    const commentary = tryParseCommentaryJson(text, ChapterCommentaryAiSchema);
    if (commentary) {
      await saveChapterCommentary(
        book,
        chapter,
        commentary.context,
        commentary.speaker,
        commentary.topics,
        commentary.culture,
        commentary.history,
        commentary.commentary,
        "gpt-4-turbo"
      )();
    }

    // Return the text directly for the useChat hook
    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Chapter commentary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate commentary" },
      { status: 500 }
    );
  }
}

async function handlePostVerseCommentary(
  book: string,
  chapter: number,
  verse: number
) {
  const prompt = `Please provide detailed verse commentary for ${book} ${chapter}:${verse}.

REQUIRED STEPS:
1. Use the strongs-concordance tool to get Hebrew/Greek word data for key words in this verse
2. Use the cross-reference tool to find related Bible verses
3. Provide grammatical analysis and theological commentary

Return ONLY a valid JSON object with this exact structure:
{
  "context": "verse context and setting",
  "strongs": {
    "word1": {
      "strongsNumber": "G1234",
      "originalWord": "Greek/Hebrew word",
      "transliteration": "pronunciation",
      "definition": "meaning",
      "usage": "biblical usage"
    }
  },
  "words": {
    "word1": {
      "originalWord": "English word",
      "grammar": "grammatical notes",
      "significance": "theological significance"
    }
  },
  "grammar": "overall grammatical analysis",
  "references": ["John 3:16", "Romans 8:28"],
  "commentary": "detailed Independent Baptist commentary"
}

Use your tools to gather accurate Strong's concordance data and cross-references. Make sure to include the original Hebrew/Greek words with their Strong's numbers.`;

  try {
    console.log(`Generating verse commentary for ${book} ${chapter}:${verse}`);

    // Generate commentary using Mastra agent
    const response = await commentaryAgent.generate([
      {
        role: "user",
        content: prompt,
      },
    ]);

    const text = response.text;
    console.log(`Generated commentary text length: ${text.length}`);
    console.log("Raw AI response (first 1000 chars):", text.substring(0, 1000));

    // Try to parse and save the commentary
    const commentary = tryParseCommentaryJson(text, VerseCommentaryAiSchema);
    if (commentary) {
      console.log("Successfully parsed commentary JSON, saving to database...");
      console.log(
        "Parsed Strong's data:",
        JSON.stringify(commentary.strongs, null, 2)
      );
      const saveResult = await saveVerseCommentary(
        book,
        chapter,
        verse,
        commentary.context,
        commentary.strongs as any,
        commentary.words as any,
        commentary.grammar,
        commentary.references,
        commentary.commentary,
        "gpt-4-turbo"
      )();

      if (E.isRight(saveResult)) {
        console.log("Successfully saved commentary to database");
      } else {
        console.error(
          "Failed to save commentary to database:",
          saveResult.left
        );
      }
    } else {
      console.error("Failed to parse commentary JSON from AI response");
      console.log("Raw AI response:", text.substring(0, 500) + "...");
    }

    // Return the text directly for the useCompletion hook
    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Verse commentary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate commentary" },
      { status: 500 }
    );
  }
}
