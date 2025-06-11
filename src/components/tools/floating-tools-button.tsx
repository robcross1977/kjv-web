"use client";

import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { useEffect, useState } from "react";

type Props = {
  isActive: boolean;
  onToggle: () => void;
};

/**
 * Floating tools button that appears in bottom-right corner
 * Toggles tools mode on/off with keyboard shortcut support
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
      <Button
        onClick={onToggle}
        size="lg"
        variant={isActive ? "default" : "outline"}
        className={`
          rounded-full w-14 h-14 shadow-lg transition-all duration-200
          ${
            isActive
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-background border-2 hover:bg-accent"
          }
        `}
        title={`${isActive ? "Close" : "Open"} Tools (Press T)`}
      >
        {isActive ? (
          <X className="h-6 w-6" />
        ) : (
          <Settings className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
