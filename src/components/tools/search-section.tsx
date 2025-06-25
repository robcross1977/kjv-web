"use client";

import { Separator } from "@/components/ui/separator";
import FreeSearch from "@/components/search/free-search/free-search";
import SelectSearch from "@/components/search/select-search";
import MastraSearch from "@/components/search/mastra-search/mastra-search";

type Props = {
  onNavigate?: () => void;
};

/**
 * Search section for the unified tools sheet
 * Contains three search types:
 * 1. AI Spiritual Search - Ask spiritual questions and get relevant verses
 * 2. Free Text Search - Search by Bible reference (e.g., "Gen 1:2-3")
 * 3. Structured Search - Use dropdowns to select book/chapter/verse
 */
export function SearchSection({ onNavigate }: Props) {
  return (
    <div className="space-y-6">
      {/* AI Spiritual Search */}
      <div className="space-y-2">
        <MastraSearch setOpen={onNavigate || (() => {})} />
      </div>

      <Separator />

      {/* Free Text Search */}
      <div className="space-y-2">
        <FreeSearch setOpen={onNavigate || (() => {})} />
      </div>

      <Separator />

      {/* Structured Search */}
      <div className="space-y-2">
        <SelectSearch setOpen={onNavigate || (() => {})} />
      </div>
    </div>
  );
}
