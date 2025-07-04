"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLastReference } from "@/hooks/use-last-reference";
import { useTools } from "@/components/tools/tools-provider";
import { parseReference } from "@/lib/reference-parser";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";

interface LastReferenceNavigatorProps {
  /** Current search parameters from the URL */
  hasCurrentSearch: boolean;
}

/**
 * Component that handles automatic navigation to user's last reference
 * - If user has search params, does nothing (user is actively searching)
 * - If no search params and user has last reference, navigates there
 * - If no search params and no last reference, navigates to John 1:1 default
 */
export default function LastReferenceNavigator({
  hasCurrentSearch,
}: LastReferenceNavigatorProps) {
  const { isLoggedIn, isAuthLoading } = useTools();
  const { lastReference, isLoading } = useLastReference(isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    // Don't navigate if user already has search parameters
    if (hasCurrentSearch) {
      console.log("NAVIGATOR: User has current search, skipping navigation");
      return;
    }

    // Don't navigate while authentication or data is still loading
    if (isAuthLoading || isLoading) {
      console.log("NAVIGATOR: Still loading, waiting...");
      return;
    }

    // Navigate based on last reference
    pipe(
      lastReference,
      O.fold(
        // No last reference - navigate to John 1:1 default
        () => {
          console.log("NAVIGATOR: No last reference, navigating to John 1:1");
          router.push("/?book=John&chapter=1");
        },
        // Has last reference - parse and navigate to it
        (ref) => {
          console.log("NAVIGATOR: Navigating to last reference:", ref);
          const navigationUrl = parseReferenceToUrl(ref);
          if (navigationUrl) {
            router.push(navigationUrl);
          } else {
            // If parsing fails, fall back to John 1:1
            console.log("NAVIGATOR: Parse failed, falling back to John 1:1");
            router.push("/?book=John&chapter=1");
          }
        }
      )
    );
  }, [hasCurrentSearch, lastReference, isLoading, isAuthLoading, router]);

  // Show loading spinner when we're loading last reference and have no current search
  if (!hasCurrentSearch && (isAuthLoading || isLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="md" showMessages={true} className="text-center" />
      </div>
    );
  }

  return null;
}

/**
 * Parses a Bible reference string into URL parameters
 * Examples: "John 3:16" -> "/?book=John&chapter=3&verse=16"
 *           "Genesis 1" -> "/?book=Genesis&chapter=1"
 *           "Genesis 1:2-5" -> "/?query=Genesis%201%3A2-5" (use query for ranges)
 */
function parseReferenceToUrl(reference: string): string | null {
  try {
    if (!reference || reference.trim() === "") {
      return null;
    }

    const parseResult = parseReference(reference);

    return pipe(
      parseResult,
      E.fold(
        (error) => {
          console.log("NAVIGATOR: Failed to parse reference:", error);
          return null;
        },
        (parsed) => {
          // For verse ranges, use query parameter (like free search)
          if (parsed.endVerse) {
            console.log(
              "NAVIGATOR: Verse range detected, using query parameter"
            );
            return `/?query=${encodeURIComponent(reference)}`;
          }

          // For single verses or chapters, use structured parameters
          let url = `/?book=${encodeURIComponent(parsed.book)}&chapter=${
            parsed.startChapter
          }`;
          if (parsed.startVerse) {
            url += `&verse=${parsed.startVerse}`;
          }

          return url;
        }
      )
    );
  } catch (error) {
    console.error("Error parsing reference:", error);
    return null;
  }
}
