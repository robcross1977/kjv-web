"use client";

import { Button } from "@/components/ui/button";
import { BookCheck } from "lucide-react";
import { useTools } from "@/components/tools/tools-provider";

export function MarkAsReadToggle() {
  try {
    const { isToolsActive, toggleTools, isLoggedIn } = useTools();

    if (!isLoggedIn) {
      return null;
    }

    return (
      <Button
        variant={isToolsActive ? "default" : "outline"}
        size="sm"
        onClick={toggleTools}
        className="flex items-center gap-2"
        title={`${
          isToolsActive ? "Disable" : "Enable"
        } mark as read mode (Press T)`}
      >
        <BookCheck className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isToolsActive ? "Mark Mode On" : "Mark Mode"}
        </span>
      </Button>
    );
  } catch (error) {
    // If auth is not configured, don't show the toggle
    return null;
  }
}
