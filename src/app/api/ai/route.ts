import { ReferenceResponse, referenceResponseSchema } from "@/types/bible";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { object } = await generateObject<ReferenceResponse>({
    model: openai("gpt-4o"),
    schema: referenceResponseSchema,
    prompt,
    system: `
      You are a bible assistant who will respond to questions
      with a collection of all the references you can find in
      the KJV version of the bible that address that question.
      Do not include deuterocanonical books in the output, this
      is a protestant bible app. 
      The references should be in the following format:
      ${JSON.stringify(referenceResponseSchema.shape.references)}
    `,
  });

  return new Response(JSON.stringify(object), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
