import { z } from "zod";

export const participantSchema = z.object({
  name: z.string(),
  calories: z.number(),
  weight: z.number(),
  sex: z.enum(["male", "female"]),
});
export type Participant = z.infer<typeof participantSchema>;

export const storageSchema = z.object({
  participants: z
    .array(participantSchema)
    .min(1, "At least one participant is required"),
  userLikes: z.array(z.string()).default([]),
  userDislikes: z.array(z.string()).default([]),
  useRestrictions: z.array(z.string()).default([]),
  budgetAmount: z.number().positive("Budget amount must be a positive number"),
  budgetPeriod: z.string().nonempty("Budget period is required"),
});

export type Period = "daily" | "weekly" | "biweekly" | "monthly" | "bimonthly";

const ingredientSchema = z.object({
  name: z.string(),
  amount: z.string(),
  estimatedCostPerAmount: z.string(),
});

const recipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(ingredientSchema),
  steps: z.array(z.string()),
});

const groceryListItemSchema = z.object({
  category: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      amount: z.string(),
    })
  ),
});

const daySchema = z.object({
  dayNumber: z
    .number()
    .int()
    .describe(
      "The user inputs how many days they want to plan for, not the day of the week"
    ),
  meals: z.array(z.string().describe("The name of the recipe")),
});

const budgetSchema = z.object({
  amount: z
    .number()
    .describe("The amount of money the user is willing to spend"),
  spent: z.number().describe("The amount of money we have spent so far"),
  remaining: z.number().describe("The amount of money we have left to spend"),
  total: z
    .number()
    .describe(
      "The total amount of money we project to spend to buy everything on our recipes"
    ),
  numberOfDays: z
    .number()
    .describe(
      "The number of days we are planning for, this is not the day of the week"
    ),
});

export const mealPlanSchema = z.object({
  budget: budgetSchema,
  schedule: z.array(daySchema),
  recipes: z.array(recipeSchema),
  groceryList: z.array(groceryListItemSchema),
});
export type MealPlan = z.infer<typeof mealPlanSchema>;
