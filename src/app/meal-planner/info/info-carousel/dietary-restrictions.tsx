"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DietaryRestrictions() {
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const storedRestrictions = localStorage.getItem("userRestrictions");
    if (storedRestrictions) {
      setRestrictions(JSON.parse(storedRestrictions));
    } else {
      const defaultRestrictions = [
        "Limit carbs to 175g/day per person.",
        "Aim for 0.8g protein per pound of body weight per day.",
        "Prefer low sugar foods",
      ];
      setRestrictions(defaultRestrictions);
      updateLocalStorage(defaultRestrictions);
    }
  }, []);

  function updateLocalStorage(updatedRestrictions: string[]) {
    localStorage.setItem(
      "userRestrictions",
      JSON.stringify(updatedRestrictions)
    );
  }

  function handleAddLike() {
    if (inputValue.trim()) {
      const updatedRestrictions = [...restrictions, inputValue.trim()];
      setRestrictions(updatedRestrictions);
      updateLocalStorage(updatedRestrictions);
      setInputValue("");
    }
  }

  function handleRemoveRestriction(index: number) {
    const updatedRestrictions = restrictions.filter((_, i) => i !== index);
    setRestrictions(updatedRestrictions);
    updateLocalStorage(updatedRestrictions);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleAddLike();
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="Enter a dietary restriction (ex: gluten free)"
          className="mr-2"
        />
        <Button onClick={handleAddLike}>Add</Button>
      </div>
      <ul className="list-disc pl-5">
        {restrictions.map((restriction, index) => (
          <li key={index} className="flex items-center mb-2">
            <span className="flex-1">{restriction}</span>
            <Button
              onClick={() => handleRemoveRestriction(index)}
              className="ml-2 bg-red-500 text-white"
            >
              -
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
