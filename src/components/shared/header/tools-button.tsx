"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Wrench } from "lucide-react";
import { useTools } from "@/components/tools/tools-provider";

/**
 * Tools button for the header that opens the tools sheet
 * Matches the style of other header buttons for consistency
 */
export function ToolsButton() {
  const { openToolsSheet, isToolsSheetOpen } = useTools();

  const tooltipText = "Open Bible study tools (Press T)";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isToolsSheetOpen ? "default" : "outline"}
            size="sm"
            onClick={() => openToolsSheet("reading")}
            className="flex items-center gap-2"
            title={tooltipText}
          >
            <Wrench className="h-4 w-4" />
            <span className="hidden min-[480px]:inline">Tools</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
