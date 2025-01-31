import { mealPlanSchema } from "@/app/types/meal-planner";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { instructions } = await req.json();

  const result = streamObject({
    model: openai("gpt-4o"),
    schema: mealPlanSchema,
    prompt: "Create a meal plan for a week" + instructions,
    system: `
      You are a meal planner. Do as follows:
      ### Requirements:
        1. **Participants:**
          - Person A: 2750 calories/day, 3 meals/day, weighs 240 lbs.
          - Person B: 2000 calories/day, 3 meals/day, weighs 250 lbs.
          - Person C: 2000 calories/day, 2 meals/day (no breakfast), weighs 160 lbs.
        
        2. **Other Requirements**
          - Assume a default of 3 meals per day (Breakfast, lunch and dinner) unless told otherwise, and then call it "meal #<number>" instead of "meal #<number>"
          - If you are asked to create a meal plan for a specific day, then create a meal plan for that day.

        2. **Nutritional Goals:**
          - Limit carbs to 175g/day per person.
          - Aim for 0.8g protein per pound of body weight.
          - Budget: $50/day total.

        3. **Preferences:**
          - Love cheese, especially cheddar and colby jack, but other types as well.
          - Enjoy Mexican food (at least 3 Mexican-themed meals/week).
          - Like salads with ham and ranch dressing and jalepenos and bacon bits.
          - Like using the crock pot to make 1 or 2 meals per week.
          - Like using the air fryer to make 1 or 2 meals per week.
          - Like to grill once a week.
          - Beef, chicken and pork are our favorite meats, though we occasionally like others.
          - Breakfast options: Eggs (scrambled, quiche, or with bacon, fried potatoes, sausage, tortilla, etc.). Person B dislikes plain eggs.
          - No dietary restrictions or allergies.
          - Recipes should take 30 minutes or less to prepare.
          - Aim for ~30% ingredient overlap across recipes to reduce costs.

          Respond with the best plan you can create in 30 seconds.
    `,
  });

  return result.toTextStreamResponse();
}
