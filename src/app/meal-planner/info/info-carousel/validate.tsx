"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { validateLocalStorageData } from "../../lib";

function ValidateComponent() {
  const router = useRouter();

  const validateData = useCallback(() => {
    try {
      const isValid = validateLocalStorageData();
      localStorage.setItem("isValidated", isValid.toString());
      router.push("/meal-planner/search");
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }, [router]);

  return <Button onClick={validateData}>Check it over!</Button>;
}

export default ValidateComponent;
