"use client";

import { Separator } from "@/components/ui/separator";
import FreeSearch from "@/components/search/free-search/free-search";
import SelectSearch from "@/components/search/select-search";

type Props = {
  onNavigate?: () => void;
};

/**
 * Search section for the unified tools sheet
 * Contains both free text search and structured book/chapter/verse search
 * Displayed vertically like the original design
 */
export function SearchSection({ onNavigate }: Props) {
  return (
    <div className="space-y-6">
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
