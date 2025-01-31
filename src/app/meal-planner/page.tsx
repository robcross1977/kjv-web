"use client";

import { useEffect, useState } from "react";
import Info from "./info";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRouter } from "next/navigation";

export default function MealPlanner() {
  const [hasData, setHasData] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isValidated] = useLocalStorage("isValidated", false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    setHasData(isValidated);
  }, [isValidated]);

  useEffect(() => {
    if (isMounted && hasData) {
      router.push("/meal-planner/search");
    }
  }, [isMounted, hasData, router]);

  if (!isMounted) {
    return null; // Avoid rendering until the component is mounted
  }

  return (
    <div className="flex flex-col w-full py-5 mx-auto stretch">
      {!hasData && <Info />}
    </div>
  );
}
