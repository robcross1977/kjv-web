"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mealPlanSchema } from "@/app/types/meal-planner";
import { MealPlan } from "@/app/types/meal-planner";
import { generateMealPlanCommand } from "../lib";
import Results from "./results";
import SpecialInstructionsForm from "./special-instructions-form";

export default function Search() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [success, command] = generateMealPlanCommand();

  if (!success) {
    return <p>Error loading meal plan.</p>;
  }

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

  const safeString = (value: string | (string | boolean)[]): string => {
    return Array.isArray(value) ? value.join(", ") : value;
  };

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
        <Results mealPlan={mealPlan} />
      )}
      <SpecialInstructionsForm
        submit={submit}
        command={command}
        isLoading={isLoading}
        input={safeString(input)}
        setInput={setInput}
        inputRef={inputRef}
      />
    </div>
  );
}
