"use client";

import { useTools } from "@/components/tools/tools-provider";
import BooksDisplay from "./results";
import { ValidBookName, WrappedRecords } from "kingjames";
import { useAutoSaveReference } from "@/hooks/use-last-reference";
import { useMemo } from "react";
import { parseReference } from "@/lib/reference-parser";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
  query?: string;
  results?: WrappedRecords;
};

export default function Search({
  book,
  chapter,
  verse,
  query,
  results,
}: Props) {
  // Format current reference for auto-saving
  const currentReference = useMemo(() => {
    console.log("SEARCH COMPONENT: Props received:", {
      book,
      chapter,
      verse,
      query,
    });

    // If we have structured navigation (book/chapter), use that
    if (book && chapter) {
      let reference = `${book} ${chapter}`;
      if (verse) {
        reference += `:${verse}`;
      }
      console.log(
        "SEARCH COMPONENT: Calculated currentReference from structure:",
        reference
      );
      return reference;
    }

    // If we have a query, try to parse it as a Bible reference
    if (query) {
      console.log("SEARCH COMPONENT: Attempting to parse query:", query);
      const parseResult = parseReference(query);
      console.log("SEARCH COMPONENT: Parse result:", parseResult);
      return pipe(
        parseResult,
        E.fold(
          (error) => {
            console.log(
              "SEARCH COMPONENT: Query not a valid reference:",
              error
            );
            return null;
          },
          (parsed) => {
            const reference = parsed.normalizedDisplay;
            console.log(
              "SEARCH COMPONENT: Calculated currentReference from query:",
              reference
            );
            console.log("SEARCH COMPONENT: Parsed object:", parsed);
            return reference;
          }
        )
      );
    }

    console.log("SEARCH COMPONENT: No valid reference found, returning null");
    return null;
  }, [book, chapter, verse, query]);

  // Automatically save current reference when user navigates (only if authenticated)
  const { isLoggedIn } = useTools();
  useAutoSaveReference(currentReference, isLoggedIn);

  return (
    <div className="flex flex-col w-full mx-auto h-screen">
      <div className="flex flex-grow w-full pt-2">
        <div className="w-11/12 lg:w-2/3 mx-auto">
          <BooksDisplay results={results} />
        </div>
      </div>
    </div>
  );
}
