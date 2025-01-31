"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { useRef } from "react";
import { MealPlan, mealPlanSchema } from "../types/meal-planner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function MealPlanner() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const { submit, isLoading, error } = useObject({
    api: "/api/meal-planner",
    schema: mealPlanSchema,
    onFinish({ object }) {
      if (object != null) {
        setMealPlan(object);
        setInput("");
        inputRef.current?.focus();
      }
    },
    onError: (e) => {
      console.log(`error: ${JSON.stringify(e)}`);
    },
  });

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (error) {
    return <p>Error loading meal plan.</p>;
  }

  return (
    <div className="flex flex-col w-full py-5 mx-auto stretch">
      {isLoading ? (
        <div className="flex justify-center items-center h-full mt-10">
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      ) : mealPlan === null ? null : (
        <ScrollArea className="h-[600px] w-full">
          <ul>
            <h2 className="text-3xl font-bold mb-4">Meal Schedule</h2>
            {mealPlan?.schedule.map((day) => (
              <li key={day.dayNumber}>
                <div className="flex flex-col">
                  <p className="text-xl font-bold">Day {day.dayNumber}:</p>
                  <ul>
                    {day.meals.map((m, i) => {
                      return (
                        <li key={i} className="ml-[1rem]">
                          {m}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
            <Separator className="my-4" />
            <h2 className="text-3xl font-bold mb-4">Recipes</h2>
            {mealPlan?.recipes.map((recipe) => (
              <div key={recipe.name} className="flex flex-col mt-4">
                <h2 key={recipe.name} className="text-xl font-bold">
                  {recipe.name}
                </h2>
                <h3 className="text-lg font-bold ml-[1rem]">Ingredients</h3>
                <ul className="list-disc ml-[2rem]">
                  {recipe.ingredients.map((i) => (
                    <li key={i.name} className="ml-[2rem]">
                      {i.amount} {i.name} ({i.estimatedCostPerAmount})
                    </li>
                  ))}
                </ul>
                <h3 className="text-lg font-bold ml-[1rem]">Steps</h3>
                <ol className="list-decimal ml-[2rem]">
                  {recipe.steps.map((s) => (
                    <li key={s} className="ml-[2rem]">
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
            <Separator className="my-4" />
            <h2 className="text-3xl font-bold mb-4">Grocery List</h2>
            {mealPlan?.groceryList.map((groceryList) => (
              <div key={groceryList.category}>
                <h3 className="text-lg font-bold ml-[1rem]">
                  {groceryList.category}
                </h3>
                <ul className="list-disc ml-[2rem]">
                  {groceryList.items.map((i) => (
                    <li key={i.name} className="ml-[2rem]">
                      {i.amount} {i.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ul>
        </ScrollArea>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const form = event.target as HTMLFormElement;
          const input = form.elements.namedItem(
            "instructions"
          ) as HTMLInputElement;

          if (input.value.trim()) {
            submit({ instructions: input.value });
          }
        }}
      >
        <input
          name="instructions"
          className="dark:bg-zinc-900 w-full p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Just say something to plan a meal..."
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </div>
  );
}
