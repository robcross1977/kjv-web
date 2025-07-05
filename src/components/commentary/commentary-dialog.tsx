"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ValidBookName } from "kingjames";
import { useStreamingCommentary } from "@/hooks/use-streaming-commentary";
import {
  BookOpen,
  MessageSquare,
  GraduationCap,
  Link,
  BookText,
  X,
} from "lucide-react";
import { StrongsWord } from "@/types/commentary";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  book: ValidBookName;
  chapter: number;
  verse?: number;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Commentary aside panel - semantic HTML for supplementary content
 * Responsive design that works on both desktop and mobile
 */
export function CommentaryDialog({
  book,
  chapter,
  verse,
  isOpen,
  onClose,
}: Props) {
  const {
    isLoading,
    isGenerating,
    error,
    commentaryText,
    commentaryData,
    hasStarted,
    startCommentary,
  } = useStreamingCommentary(book, chapter, verse);

  // Start commentary when panel opens
  useEffect(() => {
    if (isOpen && !hasStarted) {
      startCommentary();
    }
  }, [isOpen, hasStarted, startCommentary]);

  const isVerseCommentary = verse !== undefined;
  const title = isVerseCommentary
    ? `${book} ${chapter}:${verse}`
    : `${book} ${chapter}`;
  const description = isVerseCommentary
    ? "Verse commentary with word studies"
    : "Chapter overview and themes";

  if (!isOpen) return null;

  const renderContent = () => {
    if (!hasStarted) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 p-4">
          <p className="text-muted-foreground text-center">
            Click to generate commentary
          </p>
          <Button onClick={startCommentary}>Generate Commentary</Button>
        </div>
      );
    }

    if (isLoading && !commentaryText) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 p-4">
          <LoadingSpinner size="xl" />
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Generating commentary...
            </p>
            <p className="text-xs text-muted-foreground">
              This may take 30-60 seconds. You can continue reading while we
              work.
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-600 p-4 bg-red-50/50 rounded-md m-4">
          <strong>Error:</strong> {error.message}
        </div>
      );
    }

    const dataToRender = commentaryData || {};
    const textToRender = commentaryText;
    const defaultTab = "commentary";

    return (
      <div className="flex flex-col h-full">
        <Tabs defaultValue={defaultTab} className="flex flex-col h-full">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="commentary" className="text-xs sm:text-sm">
                <BookText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Commentary</span>
                <span className="sm:hidden">Text</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs sm:text-sm">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analysis</span>
                <span className="sm:hidden">Study</span>
              </TabsTrigger>
              <TabsTrigger value="references" className="text-xs sm:text-sm">
                <Link className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Cross-Refs</span>
                <span className="sm:hidden">Refs</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-4 pb-4">
              <TabsContent value="commentary" className="space-y-4 mt-4">
                <InfoCard title="Context">
                  <p>
                    {dataToRender.context ||
                      (isGenerating
                        ? "Generating context..."
                        : "No context available")}
                  </p>
                </InfoCard>
                <InfoCard title="Commentary">
                  <p className="whitespace-pre-wrap">
                    {dataToRender.commentary ||
                      (isGenerating
                        ? "Generating commentary..."
                        : textToRender)}
                  </p>
                </InfoCard>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4 mt-4">
                {dataToRender.strongs &&
                  Object.keys(dataToRender.strongs).length > 0 && (
                    <InfoCard title="Strong's Word Study">
                      <div className="space-y-4">
                        {Object.entries(dataToRender.strongs).map(
                          ([englishWord, strongsData]: [string, any]) => (
                            <div
                              key={englishWord}
                              className="border-l-4 border-blue-200 pl-4"
                            >
                              <h4 className="font-semibold text-blue-700 mb-2 text-base sm:text-lg">
                                {englishWord}
                              </h4>
                              <div className="space-y-2">
                                {typeof strongsData === "object" &&
                                strongsData.strongsNumber ? (
                                  // Single Strong's entry format
                                  <div className="p-3 border rounded-md bg-muted/20">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {strongsData.strongsNumber}
                                      </Badge>
                                      {strongsData.originalWord &&
                                        strongsData.originalWord !==
                                          "Unknown" && (
                                          <span className="font-bold text-base sm:text-lg text-green-700">
                                            {strongsData.originalWord}
                                          </span>
                                        )}
                                      {strongsData.transliteration &&
                                        strongsData.transliteration !==
                                          "Unknown" && (
                                          <span className="italic text-muted-foreground text-sm">
                                            ({strongsData.transliteration})
                                          </span>
                                        )}
                                    </div>
                                    {strongsData.definition && (
                                      <p className="text-sm mb-1">
                                        <strong>Definition:</strong>{" "}
                                        {strongsData.definition}
                                      </p>
                                    )}
                                    {strongsData.usage && (
                                      <p className="text-sm text-muted-foreground">
                                        <strong>Usage:</strong>{" "}
                                        {strongsData.usage}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  // Multiple Strong's entries format (fallback)
                                  Object.entries(strongsData || {}).map(
                                    ([strongsNum, data]: [string, any]) => (
                                      <div
                                        key={`${englishWord}-${strongsNum}`}
                                        className="p-3 border rounded-md bg-muted/20"
                                      >
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {strongsNum}
                                          </Badge>
                                          {data.originalWord &&
                                            data.originalWord !== "Unknown" && (
                                              <span className="font-bold text-base sm:text-lg text-green-700">
                                                {data.originalWord}
                                              </span>
                                            )}
                                          {data.transliteration &&
                                            data.transliteration !==
                                              "Unknown" && (
                                              <span className="italic text-muted-foreground text-sm">
                                                ({data.transliteration})
                                              </span>
                                            )}
                                        </div>
                                        {data.definition &&
                                          data.definition !==
                                            `Strong's Number: ${strongsNum}` && (
                                            <p className="text-sm mb-1">
                                              <strong>Definition:</strong>{" "}
                                              {data.definition}
                                            </p>
                                          )}
                                        {data.usage && (
                                          <p className="text-sm text-muted-foreground">
                                            <strong>Usage:</strong> {data.usage}
                                          </p>
                                        )}
                                      </div>
                                    )
                                  )
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </InfoCard>
                  )}
                {dataToRender.grammar && (
                  <InfoCard title="Grammatical Analysis">
                    <p className="text-sm">{dataToRender.grammar}</p>
                  </InfoCard>
                )}
                {dataToRender.speaker && (
                  <InfoCard title="Speaker">
                    <p className="text-sm">{dataToRender.speaker}</p>
                  </InfoCard>
                )}
                {dataToRender.topics && dataToRender.topics.length > 0 && (
                  <InfoCard title="Topics">
                    <div className="flex flex-wrap gap-2">
                      {dataToRender.topics.map((topic: string) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </InfoCard>
                )}
                {dataToRender.culture && (
                  <InfoCard title="Cultural Context">
                    <p className="text-sm">{dataToRender.culture}</p>
                  </InfoCard>
                )}
                {dataToRender.history && (
                  <InfoCard title="Historical Background">
                    <p className="text-sm">{dataToRender.history}</p>
                  </InfoCard>
                )}
              </TabsContent>

              <TabsContent value="references" className="space-y-4 mt-4">
                {dataToRender.references &&
                dataToRender.references.length > 0 ? (
                  <InfoCard title="Cross-References">
                    <div className="flex flex-wrap gap-2">
                      {dataToRender.references.map((ref: string) => (
                        <button
                          key={ref}
                          onClick={() => {
                            const url = `/?query=${encodeURIComponent(ref)}`;
                            window.location.href = url;
                          }}
                          className="inline-flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                        >
                          {ref}
                        </button>
                      ))}
                    </div>
                  </InfoCard>
                ) : (
                  <p className="text-sm text-center text-muted-foreground py-8">
                    No cross-references available.
                  </p>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop - only on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Simple Commentary Aside - Always visible when open */}
      {isOpen && (
        <aside
          className="fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[28rem] bg-background border-l shadow-lg z-50"
          aria-label="Bible Commentary"
          role="complementary"
        >
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b bg-muted/30">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isVerseCommentary ? (
                <MessageSquare className="w-5 h-5 flex-shrink-0" />
              ) : (
                <BookOpen className="w-5 h-5 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-lg truncate">{title}</h2>
                <p className="text-sm text-muted-foreground truncate">
                  {description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 flex-shrink-0"
              title="Close Commentary"
            >
              <X className="w-4 h-4" />
            </Button>
          </header>

          {/* Content */}
          <main className="h-full overflow-hidden pb-16">
            {renderContent()}
          </main>
        </aside>
      )}
    </>
  );
}

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-3 sm:p-4 border rounded-lg bg-background">
    <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-semibold tracking-tight">
      {title}
    </h3>
    <div className="text-sm text-muted-foreground">{children}</div>
  </div>
);
