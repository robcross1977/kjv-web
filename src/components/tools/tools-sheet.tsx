"use client";

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Bookmark, Wrench } from "lucide-react";
import { SearchSection } from "./search-section";
import { ReadingSection } from "./reading-section";

export type ToolSection = "search" | "reading" | "bookmarks";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSection?: ToolSection;
  currentContext?: {
    book?: string;
    chapter?: number;
    verses?: number[];
  };
};

/**
 * Unified tools sheet containing all Bible study tools
 * Organized into sections: Search, Reading Tools, and Bookmarks
 */
export function ToolsSheet({
  isOpen,
  onOpenChange,
  defaultSection = "search",
  currentContext,
}: Props) {
  const [activeSection, setActiveSection] =
    useState<ToolSection>(defaultSection);

  const getSectionIcon = (section: ToolSection) => {
    return pipe(
      section,
      O.fromPredicate((s): s is ToolSection =>
        ["search", "reading", "bookmarks"].includes(s)
      ),
      O.fold(
        () => <Wrench className="h-4 w-4" />,
        (s) => {
          switch (s) {
            case "search":
              return <Search className="h-4 w-4" />;
            case "reading":
              return <BookOpen className="h-4 w-4" />;
            case "bookmarks":
              return <Bookmark className="h-4 w-4" />;
          }
        }
      )
    );
  };

  const getSectionTitle = (section: ToolSection): string => {
    return pipe(
      section,
      O.fromPredicate((s): s is ToolSection =>
        ["search", "reading", "bookmarks"].includes(s)
      ),
      O.fold(
        () => "Tools",
        (s) => {
          switch (s) {
            case "search":
              return "Search Scripture";
            case "reading":
              return "Reading Tools";
            case "bookmarks":
              return "Bookmarks";
          }
        }
      )
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader className="bg-gray-100 rounded-lg p-4 mb-6">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <Wrench className="h-6 w-6" />
            Bible Study Tools
          </SheetTitle>
          <SheetDescription className="text-base">
            Search scripture, manage reading progress, and organize bookmarks
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs
            value={activeSection}
            onValueChange={(value: string) =>
              setActiveSection(value as ToolSection)
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="search" className="flex items-center gap-2">
                {getSectionIcon("search")}
                <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
              <TabsTrigger value="reading" className="flex items-center gap-2">
                {getSectionIcon("reading")}
                <span className="hidden sm:inline">Reading</span>
              </TabsTrigger>
              <TabsTrigger
                value="bookmarks"
                className="flex items-center gap-2"
              >
                {getSectionIcon("bookmarks")}
                <span className="hidden sm:inline">Bookmarks</span>
              </TabsTrigger>
            </TabsList>

            <div className="space-y-6">
              <TabsContent value="search" className="space-y-4 mt-0">
                <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-primary">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                    {getSectionIcon("search")}
                    {getSectionTitle("search")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Find verses and passages throughout the Bible
                  </p>
                </div>
                <SearchSection onNavigate={() => onOpenChange(false)} />
              </TabsContent>

              <TabsContent value="reading" className="space-y-4 mt-0">
                <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-primary">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                    {getSectionIcon("reading")}
                    {getSectionTitle("reading")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track your reading progress and manage verses
                  </p>
                </div>
                <ReadingSection currentContext={currentContext} />
              </TabsContent>

              <TabsContent value="bookmarks" className="space-y-4 mt-0">
                <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-primary">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                    {getSectionIcon("bookmarks")}
                    {getSectionTitle("bookmarks")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Save and organize your favorite passages
                  </p>
                </div>
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <div className="text-center">
                    <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Bookmarks Coming Soon</p>
                    <p className="text-sm">
                      Save your favorite verses and passages for quick access
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
