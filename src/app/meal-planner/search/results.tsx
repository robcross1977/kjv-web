import { Separator } from "@/components/ui/separator";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MealPlan } from "@/app/meal-planner/types";

export default function Results({ mealPlan }: { mealPlan: MealPlan }) {
  return (
    <ScrollArea className="h-[600px] w-full">
      <ul>
        <h2 className="text-3xl font-bold mb-4">Meal Schedule</h2>

        <p>Budget: ${mealPlan?.budget.total}</p>
        <p>Remaining: ${mealPlan?.budget.remaining}</p>
        <p>Spent: ${mealPlan?.budget.spent}</p>
        <p>Days: {mealPlan?.budget.numberOfDays}</p>
        <p>Amount: ${mealPlan?.budget.amount}</p>

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
  );
}
