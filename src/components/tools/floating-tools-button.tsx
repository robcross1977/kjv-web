"use client";

import { Switch } from "@/components/ui/switch";
import { BookCheck } from "lucide-react";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { useEffect, useState } from "react";

type Props = {
  isActive: boolean;
  onToggle: () => void;
};

/**
 * Floating mark-as-read toggle that appears in bottom-right corner
 * Enables/disables interactive verse marking with keyboard shortcut support
 */
export function FloatingToolsButton({ isActive, onToggle }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      pipe(
        O.fromNullable(event.key),
        O.map((key) => key.toLowerCase()),
        O.filter(
          (key) =>
            key === "t" && !event.ctrlKey && !event.metaKey && !event.altKey
        ),
        O.map(() => {
          // Only trigger if not typing in an input
          const activeElement = document.activeElement;
          const isTyping =
            activeElement?.tagName === "INPUT" ||
            activeElement?.tagName === "TEXTAREA" ||
            activeElement?.getAttribute("contenteditable") === "true";

          if (!isTyping) {
            event.preventDefault();
            onToggle();
          }
        })
      );
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [onToggle]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[160px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookCheck className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Mark as Read</div>
              <div className="text-xs text-muted-foreground">Press T</div>
            </div>
          </div>
          <Switch checked={isActive} onCheckedChange={onToggle} />
        </div>
      </div>
    </div>
  );
}
