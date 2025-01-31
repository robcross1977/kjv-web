import { mealPlanSchema } from "@/app/types/meal-planner";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { system, prompt } = await req.json();

  const result = streamObject({
    model: openai("gpt-4o"),
    schema: mealPlanSchema,
    prompt:
      "Create a meal plan for a week according to your job as a meal planner with the following special instructions to add to your job" +
      prompt,
    system,
  });

  return result.toTextStreamResponse();
}
