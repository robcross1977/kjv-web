"use client";

import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { useTools } from "@/components/tools/tools-provider";

/**
 * Tools button for the header that opens the tools sheet
 * Matches the style of other header buttons for consistency
 */
export function ToolsButton() {
  const { openToolsSheet, isToolsSheetOpen } = useTools();

  return (
    <Button
      variant={isToolsSheetOpen ? "default" : "outline"}
      size="sm"
      onClick={() => openToolsSheet("reading")}
      className="flex items-center gap-2"
      title="Open Bible study tools (Press T)"
    >
      <Wrench className="h-4 w-4" />
      <span className="hidden sm:inline">Tools</span>
    </Button>
  );
}
