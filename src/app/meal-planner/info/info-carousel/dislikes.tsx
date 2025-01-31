"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DislikesProps {}

export function Dislikes({}: DislikesProps) {
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const storedDislikes = localStorage.getItem("userDislikes");
    if (storedDislikes) {
      setDislikes(JSON.parse(storedDislikes));
    }
  }, []);

  function updateLocalStorage(updatedDislikes: string[]) {
    localStorage.setItem("userDislikes", JSON.stringify(updatedDislikes));
  }

  function handleAddLike() {
    if (inputValue.trim()) {
      const updatedDislikes = [...dislikes, inputValue.trim()];
      setDislikes(updatedDislikes);
      updateLocalStorage(updatedDislikes);
      setInputValue("");
    }
  }

  function handleRemoveLike(index: number) {
    const updatedDislikes = dislikes.filter((_, i) => i !== index);
    setDislikes(updatedDislikes);
    updateLocalStorage(updatedDislikes);
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
          placeholder="Enter food you dislike (ex: broccoli)"
          className="mr-2"
        />
        <Button onClick={handleAddLike}>Add</Button>
      </div>
      <ul className="list-disc pl-5">
        {dislikes.map((dislike, index) => (
          <li key={index} className="flex items-center mb-2">
            <span className="flex-1">{dislike}</span>
            <Button
              onClick={() => handleRemoveLike(index)}
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
