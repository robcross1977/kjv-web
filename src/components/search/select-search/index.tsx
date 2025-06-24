"use client";

import { ValidBookName } from "kingjames";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookSelect from "./book-select";
import { getBookOptionFromBook } from "./book-select/book-filter";
import ChapterSelect from "./chapter-select";
import VerseSelect from "./verse-select";
import { KeyValueItem } from "@/components/shared/types";
import { Button } from "@/components/ui/button";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export default function SelectSearch({ book, chapter, verse, setOpen }: Props) {
  const router = useRouter();

  // Book State
  const selectedBookOption = getBookOptionFromBook(book ?? "genesis");
  const [selectedBook, setSelectedBook] = useState<KeyValueItem>({
    key: selectedBookOption.key,
    value: selectedBookOption.value,
  });

  // Chapter State
  const selectedChapterOption = chapter ?? 1;
  const [selectedChapter, setSelectedChapter] = useState<KeyValueItem | null>({
    key: selectedChapterOption,
    value: String(selectedChapterOption),
  });

  // Verse State
  const selectedVerseOption = verse ?? "All";
  const [selectedVerse, setSelectedVerse] = useState<KeyValueItem | null>({
    key: selectedVerseOption === "All" ? 0 : selectedChapterOption,
    value:
      selectedVerseOption === "All" ? "All" : String(selectedChapterOption),
  });

  const selectBook = (book: ValidBookName) => {
    const selectedBookOption = getBookOptionFromBook(book);
    setSelectedBook({
      key: selectedBookOption.key,
      value: selectedBookOption.value,
    });
  };

  const selectChapter = (chapter: number) => {
    setSelectedChapter({
      key: chapter,
      value: String(chapter),
    });
  };

  const selectVerse = (verse: number | "All") => {
    const selectedVerseOption = verse;

    setSelectedVerse({
      key: selectedVerseOption === "All" ? 0 : selectedVerseOption,
      value:
        selectedVerseOption === "All" ? "All" : String(selectedVerseOption),
    });
  };

  useEffect(() => {
    selectBook(book ?? "genesis");
    selectChapter(chapter ?? 1);
    selectVerse(verse ?? "All");
  }, [book, chapter, verse]);

  return (
    <div className="flex flex-col">
      <h3 className="self-center pb-4 font-semibold text-lg">
        Search by Selection
      </h3>
      <div className="flex flex-row justify-start items-center gap-1">
        <div className="flex-grow">
          <BookSelect
            selectedBook={selectedBook}
            setSelectedBook={setSelectedBook}
          />
        </div>
        <div className="w-20">
          <ChapterSelect
            selectedBook={selectedBook.value.toLowerCase() as ValidBookName}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
          />
        </div>
        <div className="w-20 hidden sm:block">
          <VerseSelect
            selectedBook={selectedBook.value.toLowerCase() as ValidBookName}
            selectedChapter={Number(selectedChapter?.value)}
            selectedVerse={selectedVerse}
            setSelectedVerse={setSelectedVerse}
          />
        </div>

        <div className="border-5 self-end">
          <Button
            type="submit"
            className={`
            w-14
            font-small
            rounded-lg
            text-sm
            p-2
          `}
            onClick={() => {
              const book = selectedBook.value.toLowerCase();
              const chapter = Number(selectedChapter?.value);
              const verse =
                selectedVerse?.value === "All"
                  ? undefined
                  : Number(selectedVerse?.value);
              const q = `?book=${book}&chapter=${chapter}${
                verse ? `&verse=${verse}` : ""
              }`;

              console.log("SELECT SEARCH: Navigation triggered", {
                book,
                chapter,
                verse,
                url: `/${q}`,
              });

              setOpen(false);

              router.push(`/${q}`);
            }}
          >
            Go
          </Button>
        </div>
      </div>
    </div>
  );
}
