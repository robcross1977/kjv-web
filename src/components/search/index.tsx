"use client";

import { useTools } from "@/components/tools/tools-provider";
import BooksDisplay from "./results";
import { ValidBookName, WrappedRecords } from "kingjames";
import { useAutoSaveReference } from "@/hooks/use-last-reference";
import { useMemo } from "react";
import { parseReference } from "@/lib/reference-parser";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon, MessageSquare, Book } from "lucide-react";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
  query?: string;
  results?: WrappedRecords;
  aiContext?: string;
};

export default function Search({
  book,
  chapter,
  verse,
  query,
  results,
  aiContext,
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

  // Show search interface when no results are displayed
  const showSearchInterface =
    (!results ||
      (results.type === "none" && Object.keys(results.records).length === 0)) &&
    !aiContext;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Welcome Section for Empty State */}
      {showSearchInterface && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent leading-tight py-2">
                Bible Study
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Search, read, and explore the King James Bible using the search
                bar above
              </p>
              <div className="max-w-2xl mx-auto">
                <div className="bg-card/50 border border-border/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 text-lg">How to Search:</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <Book className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium">Bible References</p>
                      <p className="text-muted-foreground">
                        John 3:16, Genesis 1, Psalm 23:1-6
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <SearchIcon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium">Keywords</p>
                      <p className="text-muted-foreground">
                        love, faith, hope, salvation
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium">AI Questions</p>
                      <p className="text-muted-foreground">
                        What is faith? Tell me about love
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AI Search Results Section */}
      {aiContext && (
        <section className="py-8">
          <div className="bg-gradient-to-r from-amber-50/30 via-amber-50/50 to-amber-50/30 py-6 mb-8">
            <div className="container mx-auto px-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent flex items-center justify-center gap-2 leading-tight py-1">
                  <SearchIcon className="w-6 h-6 text-primary" />
                  AI Search Results
                </h2>
                <p className="text-lg text-muted-foreground">
                  &ldquo;{query}&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95">
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {aiContext}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Bible Content Section */}
      {results && (
        <section className="py-8">
          <div className="bg-gradient-to-r from-emerald-50/30 via-emerald-50/50 to-emerald-50/30 py-6 mb-8">
            <div className="container mx-auto px-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent leading-tight py-1">
                  Bible Reading
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Read and study the King James Bible
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <BooksDisplay results={results} />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
