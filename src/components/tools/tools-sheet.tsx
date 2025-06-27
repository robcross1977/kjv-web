"use client";

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { useState } from "react";
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetOverlay,
  SheetPortal,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Bookmark, Wrench } from "lucide-react";
import { ReadingSection } from "./reading-section";
import { BookmarksSection } from "../bookmarks/bookmarks-section";

export type ToolSection = "reading" | "bookmarks";

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
  defaultSection = "reading",
  currentContext,
}: Props) {
  const [activeSection, setActiveSection] =
    useState<ToolSection>(defaultSection);

  const getSectionIcon = (section: ToolSection) => {
    return pipe(
      section,
      O.fromPredicate((s): s is ToolSection =>
        ["reading", "bookmarks"].includes(s)
      ),
      O.fold(
        () => <Wrench className="h-4 w-4" />,
        (s) => {
          switch (s) {
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
        ["reading", "bookmarks"].includes(s)
      ),
      O.fold(
        () => "Tools",
        (s) => {
          switch (s) {
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
      <SheetPortal>
        <SheetOverlay className="bg-black/30 backdrop-blur-sm" />
        <SheetPrimitive.Content
          className={cn(
            "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
            "inset-y-0 right-0 h-full w-full sm:max-w-2xl border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
          )}
        >
          <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
          <SheetHeader className="bg-gray-100 rounded-lg p-4 mb-6 mt-4 border-l-4 border-primary">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold text-primary">
              <Wrench className="h-6 w-6" />
              Bible Study Tools
            </SheetTitle>
            <SheetDescription className="text-base">
              Manage reading progress and organize bookmarks
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
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger
                  value="reading"
                  className="flex items-center gap-2 text-gray-700 data-[state=active]:text-primary data-[state=active]:bg-white"
                >
                  {getSectionIcon("reading")}
                  <span className="hidden sm:inline">Reading</span>
                </TabsTrigger>
                <TabsTrigger
                  value="bookmarks"
                  className="flex items-center gap-2 text-gray-700 data-[state=active]:text-primary data-[state=active]:bg-white"
                >
                  {getSectionIcon("bookmarks")}
                  <span className="hidden sm:inline">Bookmarks</span>
                </TabsTrigger>
              </TabsList>

              <div className="space-y-6">
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
                  <BookmarksSection currentContext={currentContext} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}
