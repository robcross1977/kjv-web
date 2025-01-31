"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Likes() {
  const [likes, setLikes] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const storedLikes = localStorage.getItem("userLikes");
    if (storedLikes) {
      setLikes(JSON.parse(storedLikes));
    }
  }, []);

  function updateLocalStorage(updatedLikes: string[]) {
    localStorage.setItem("userLikes", JSON.stringify(updatedLikes));
  }

  function handleAddLike() {
    if (inputValue.trim()) {
      const updatedLikes = [...likes, inputValue.trim()];
      setLikes(updatedLikes);
      updateLocalStorage(updatedLikes);
      setInputValue("");
    }
  }

  function handleRemoveLike(index: number) {
    const updatedLikes = likes.filter((_, i) => i !== index);
    setLikes(updatedLikes);
    updateLocalStorage(updatedLikes);
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
          placeholder="Enter a food like"
          className="mr-2"
        />
        <Button onClick={handleAddLike}>Add</Button>
      </div>
      <ul className="list-disc pl-5">
        {likes.map((like, index) => (
          <li key={index} className="flex items-center mb-2">
            <span className="flex-1">{like}</span>
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
