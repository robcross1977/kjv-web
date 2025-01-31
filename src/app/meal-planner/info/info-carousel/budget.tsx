"use client";

import { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Input } from "@/components/ui/input";
import { Period } from "@/app/meal-planner/types";

// Define the options for the select input
const periodOptions: Array<{ value: Period; label: string }> = [
  { value: "daily", label: "a day" },
  { value: "weekly", label: "a week" },

  { value: "biweekly", label: "every two weeks" },
  { value: "monthly", label: "a month" },
  { value: "bimonthly", label: "twice monthly" },
];

const AVG_AMERICAN_DAILY_FOOD_COST = 22;

function BudgetInput() {
  const [amount, setAmount] = useLocalStorage<number>(
    "budgetAmount",
    AVG_AMERICAN_DAILY_FOOD_COST
  );
  const [period, setPeriod] = useLocalStorage<Period>("budgetPeriod", "daily");

  useEffect(() => {
    const storedAmount = localStorage.getItem("budgetAmount");
    const storedPeriod = localStorage.getItem("budgetPeriod");

    if (storedAmount === null) setAmount(AVG_AMERICAN_DAILY_FOOD_COST);
    if (storedPeriod === null) setPeriod("daily");
  }, [setAmount, setPeriod]);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };

  // Handle period change
  const handlePeriodChange = (value: Period) => {
    setPeriod(value);
  };

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <p className="text-lg font-medium text-gray-700 italic">
          Let's plan for
        </p>
        <Input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="p-2 border border-gray-300 rounded-md w-24"
          placeholder="Enter amount"
        />
        <p className="text-lg font-medium text-gray-700 italic">dollars</p>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default BudgetInput;
