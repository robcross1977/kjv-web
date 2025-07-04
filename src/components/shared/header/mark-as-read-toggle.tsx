"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookCheck } from "lucide-react";
import { useTools } from "@/components/tools/tools-provider";

export function MarkAsReadToggle() {
  const { isToolsActive, toggleTools, isLoggedIn } = useTools();

  if (!isLoggedIn) {
    return null;
  }

  const tooltipText = `${
    isToolsActive ? "Disable" : "Enable"
  } mark as read mode (Press T)`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isToolsActive ? "default" : "outline"}
            size="sm"
            onClick={toggleTools}
            className="flex items-center gap-2"
            title={tooltipText}
          >
            <BookCheck className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isToolsActive ? "Mark Mode On" : "Mark Mode"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
