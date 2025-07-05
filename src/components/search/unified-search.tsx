"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Search, Book, MessageSquare, ChevronDown, X } from "lucide-react";
import { ValidBookName, chapterCountFrom, verseCountFrom } from "kingjames";
import { parseReference } from "@/lib/reference-parser";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";

// Bible books data
const BIBLE_BOOKS: ValidBookName[] = [
  "genesis",
  "exodus",
  "leviticus",
  "numbers",
  "deuteronomy",
  "joshua",
  "judges",
  "ruth",
  "1 samuel",
  "2 samuel",
  "1 kings",
  "2 kings",
  "1 chronicles",
  "2 chronicles",
  "ezra",
  "nehemiah",
  "esther",
  "job",
  "psalms",
  "proverbs",
  "ecclesiastes",
  "song of solomon",
  "isaiah",
  "jeremiah",
  "lamentations",
  "ezekiel",
  "daniel",
  "hosea",
  "joel",
  "amos",
  "obadiah",
  "jonah",
  "micah",
  "nahum",
  "habakkuk",
  "zephaniah",
  "haggai",
  "zechariah",
  "malachi",
  "matthew",
  "mark",
  "luke",
  "john",
  "acts",
  "romans",
  "1 corinthians",
  "2 corinthians",
  "galatians",
  "ephesians",
  "philippians",
  "colossians",
  "1 thessalonians",
  "2 thessalonians",
  "1 timothy",
  "2 timothy",
  "titus",
  "philemon",
  "hebrews",
  "james",
  "1 peter",
  "2 peter",
  "1 john",
  "2 john",
  "3 john",
  "jude",
  "revelation",
];

const formatBookName = (book: ValidBookName): string => {
  return capitalizeFirstAlphabeticCharacter(book);
};

interface UnifiedSearchProps {
  placeholder?: string;
  className?: string;
}

export default function UnifiedSearch({
  placeholder = "Search Bible: try 'John 3:16', 'love', or ask AI...",
  className = "",
}: UnifiedSearchProps) {
  const [input, setInput] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ValidBookName | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [mode, setMode] = useState<"text" | "structured">("text");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Get available chapters for selected book
  const availableChapters = selectedBook
    ? Array.from({ length: chapterCountFrom(selectedBook) }, (_, i) => i + 1)
    : [];

  // Get available verses for selected book/chapter
  const availableVerses =
    selectedBook && selectedChapter
      ? pipe(
          verseCountFrom(selectedBook, selectedChapter),
          O.fold(
            () => [],
            (count: number) => Array.from({ length: count }, (_, i) => i + 1)
          )
        )
      : [];

  const handleSearch = (searchInput: string = input) => {
    if (!searchInput.trim()) return;

    // Check if it looks like a Bible reference
    const parseResult = parseReference(searchInput);

    pipe(
      parseResult,
      E.fold(
        // Not a Bible reference - treat as AI/text search
        () => {
          // If it contains question words or is longer, treat as AI query
          const questionWords = [
            "what",
            "who",
            "where",
            "when",
            "why",
            "how",
            "tell me",
            "explain",
          ];
          const isQuestion =
            questionWords.some((word) =>
              searchInput.toLowerCase().includes(word)
            ) ||
            searchInput.includes("?") ||
            searchInput.split(" ").length > 3;

          if (isQuestion) {
            router.push(`/?ai_query=${encodeURIComponent(searchInput)}`);
          } else {
            router.push(`/?query=${encodeURIComponent(searchInput)}`);
          }
        },
        // Valid Bible reference - navigate to it
        (parsed) => {
          let url = `/?book=${encodeURIComponent(parsed.book)}&chapter=${
            parsed.startChapter
          }`;
          if (parsed.startVerse) {
            if (parsed.endVerse) {
              // Range - use query parameter
              url = `/?query=${encodeURIComponent(searchInput)}`;
            } else {
              // Single verse
              url += `&verse=${parsed.startVerse}`;
            }
          }
          router.push(url);
        }
      )
    );

    setDisplayValue(searchInput);
    setInput("");
    setIsOpen(false);
  };

  const handleStructuredSearch = () => {
    if (!selectedBook || !selectedChapter) return;

    let url = `/?book=${selectedBook}&chapter=${selectedChapter}`;
    if (selectedVerse) {
      url += `&verse=${selectedVerse}`;
    }
    router.push(url);

    // Update display value to show what was selected
    let displayText = formatBookName(selectedBook);
    if (selectedChapter) {
      displayText += ` ${selectedChapter}`;
      if (selectedVerse) {
        displayText += `:${selectedVerse}`;
      }
    }
    setDisplayValue(displayText);

    setIsOpen(false);
    setSelectedBook(null);
    setSelectedChapter(null);
    setSelectedVerse(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (mode === "structured") {
        handleStructuredSearch();
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Auto-suggest based on input
  const suggestions = input.trim()
    ? BIBLE_BOOKS.filter((book) =>
        formatBookName(book).toLowerCase().includes(input.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className={`relative ${className}`}>
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          // Only allow closing if user clicks outside or makes a selection
          if (!open) {
            setIsOpen(false);
          }
        }}
      >
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              ref={inputRef}
              value={displayValue}
              readOnly
              placeholder={placeholder}
              className="pl-10 pr-12 h-10 bg-background/80 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200 cursor-pointer"
              onClick={() => setIsOpen(true)}
              data-search-input
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[400px] p-0 max-h-[80vh] overflow-hidden flex flex-col"
          align="start"
        >
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-border p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2 flex-1">
                <Button
                  variant={mode === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("text")}
                  className="flex-1"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Smart Search
                </Button>
                <Button
                  variant={mode === "structured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("structured")}
                  className="flex-1"
                >
                  <Book className="w-4 h-4 mr-2" />
                  Browse
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {mode === "text" ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Enter your search:
                  </label>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="John 3:16, love, or ask AI anything..."
                    className="w-full"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Examples:</p>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Reference
                      </Badge>
                      <span className="text-muted-foreground">
                        John 3:16, Genesis 1, Psalm 23:1-6
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Keyword
                      </Badge>
                      <span className="text-muted-foreground">
                        love, faith, hope, salvation
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        AI Question
                      </Badge>
                      <span className="text-muted-foreground">
                        What is faith? Tell me about love
                      </span>
                    </div>
                  </div>
                </div>

                {suggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Book suggestions:
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {suggestions.map((book) => (
                        <Button
                          key={book}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            setInput(formatBookName(book));
                            handleSearch(formatBookName(book));
                          }}
                        >
                          {formatBookName(book)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleSearch()}
                  disabled={!input.trim()}
                  className="w-full"
                >
                  Search
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Book <span className="text-red-500">*</span>
                  </label>
                  <Command>
                    <CommandInput placeholder="Search books..." />
                    <CommandList className="max-h-32">
                      <CommandEmpty>No books found.</CommandEmpty>
                      <CommandGroup>
                        {BIBLE_BOOKS.map((book) => (
                          <CommandItem
                            key={book}
                            onSelect={() => {
                              setSelectedBook(book);
                              setSelectedChapter(null);
                              setSelectedVerse(null);
                            }}
                          >
                            {formatBookName(book)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>

                {selectedBook && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Chapter <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-6 gap-1 max-h-24 overflow-y-auto">
                      {availableChapters.map((chapter) => (
                        <Button
                          key={chapter}
                          variant={
                            selectedChapter === chapter ? "default" : "outline"
                          }
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            setSelectedChapter(chapter);
                            setSelectedVerse(null); // Reset verse when chapter changes
                          }}
                        >
                          {chapter}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBook &&
                  selectedChapter &&
                  availableVerses.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Verse (optional)
                      </label>
                      <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
                        <Button
                          variant={
                            selectedVerse === null ? "default" : "outline"
                          }
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => setSelectedVerse(null)}
                        >
                          All
                        </Button>
                        {availableVerses.map((verse) => (
                          <Button
                            key={verse}
                            variant={
                              selectedVerse === verse ? "default" : "outline"
                            }
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setSelectedVerse(verse)}
                          >
                            {verse}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="space-y-2">
                  {selectedBook && !selectedChapter && (
                    <p className="text-xs text-muted-foreground">
                      Please select a chapter to continue
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleStructuredSearch}
                      disabled={!selectedBook || !selectedChapter}
                      className="flex-1"
                    >
                      Go to{" "}
                      {selectedBook ? formatBookName(selectedBook) : "Book"}
                      {selectedChapter ? ` ${selectedChapter}` : ""}
                      {selectedVerse ? `:${selectedVerse}` : ""}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-3 bg-muted/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquare className="w-3 h-3" />
              <span>
                Tip: Ask AI questions like &ldquo;What does love mean in the
                Bible?&rdquo;
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
