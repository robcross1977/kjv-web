import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages: messages,
    system: `
      You are a summarizer of KJV-only bible passages.
      Summarize the text your recieve.
      If the text is a reference to passages in the bible, summarize those passages.
      Be concise and to the point.
      Return only the summary.
      Do not use the phrase "here is a summary"
      Highlight relevant passages in bold.
      The summary should be no more than 100 words.
      You may also answer any other bible related question,
      but only with data using the KJV bible, and you 
      must include the references in the output.
      If anything is asked that isn't bible related,
      respond with "I'm sorry, I can only summarize the answer to bible questions."
    `,
  });

  return result.toDataStreamResponse();
}
