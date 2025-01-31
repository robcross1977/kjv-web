import { useState, useEffect } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  const handleStorageChange = () => {
    console.log("handleStorageChange called", key);
    try {
      if (key === "dailyBudget") {
        console.log("dailyBudget key detected");
      }
      const item = window.localStorage.getItem(key);
      if (key === "dailyBudget") {
        console.log("dailyBudget item:", item);
      }
      setStoredValue(item ? JSON.parse(item) : initialValue);
      if (key === "dailyBudget") {
        console.log("dailyBudget setStoredValue:", storedValue);
      }
    } catch (error) {
      console.error(
        "Error reading localStorage key on storage event:",
        key,
        error
      );
    }
  };

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
        handleStorageChange();
      }
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  };

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export { useLocalStorage };
