import { ValidBookName } from "kingjames";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookSelect from "./book-select";
import { getBookOptionFromBook } from "./book-select/book-filter";
import { KeyValueItem } from "@/components/shared/combobox";
import ChapterSelect from "./chapter-select";
import VerseSelect from "./verse-select";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
};
export default function SelectSearch({ book, chapter, verse }: Props) {
  const router = useRouter();

  // Book State
  const selectedBookOption = getBookOptionFromBook(book ?? "genesis");
  const [selectedBook, setSelectedBook] = useState<KeyValueItem>({
    key: selectedBookOption.key,
    value: selectedBookOption.value,
  });
  const [bookQuery, setBookQuery] = useState<string>("");

  // Chapter State
  const selectedChapterOption = chapter ?? 1;
  const [selectedChapter, setSelectedChapter] = useState<KeyValueItem>({
    key: selectedChapterOption,
    value: String(selectedChapterOption),
  });
  const [chapterQuery, setChapterQuery] = useState<string>("");

  // Verse State
  const selectedVerseOption = verse ?? "All";
  const [selectedVerse, setSelectedVerse] = useState<KeyValueItem>({
    key: selectedVerseOption === "All" ? 0 : selectedChapterOption,
    value:
      selectedVerseOption === "All" ? "All" : String(selectedChapterOption),
  });
  const [verseQuery, setVerseQuery] = useState<string>("");

  useEffect(() => {
    console.log(
      `In use effect: book: ${book}, chapter: ${chapter}, verse: ${verse}`
    );
    const selectedBookOption = getBookOptionFromBook(book ?? "genesis");
    setSelectedBook({
      key: selectedBookOption.key,
      value: selectedBookOption.value,
    });

    const selectedChapterOption = chapter ?? 1;
    setSelectedChapter({
      key: selectedChapterOption,
      value: String(selectedChapterOption),
    });

    const selectedVerseOption = verse ?? "All";
    setSelectedVerse({
      key: selectedVerseOption === "All" ? 0 : selectedVerseOption,
      value:
        selectedVerseOption === "All" ? "All" : String(selectedVerseOption),
    });
  }, [book, chapter, verse]);

  return (
    <div className="flex flex-row justify-start items-center gap-1">
      <div className="flex-grow">
        <BookSelect
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          query={bookQuery}
          setQuery={setBookQuery}
        />
      </div>
      <div className="w-24">
        <ChapterSelect
          selectedBook={selectedBook.value.toLowerCase() as ValidBookName}
          selectedChapter={selectedChapter}
          setSelectedChapter={setSelectedChapter}
          query={chapterQuery}
          setQuery={setChapterQuery}
        />
      </div>
      <div className="w-24">
        <VerseSelect
          selectedBook={selectedBook.value.toLowerCase() as ValidBookName}
          selectedChapter={Number(selectedChapter.value)}
          selectedVerse={selectedVerse}
          setSelectedVerse={setSelectedVerse}
          query={verseQuery}
          setQuery={setVerseQuery}
        />
      </div>

      <div className="border-5 mr-2">
        <button
          type="submit"
          className={`
            text-white
            bg-teal-600
            w-24
            hover:bg-teal-700
            focus:ring-4
            focus:outline-none
            focus:ring-blue-300
            font-small
            rounded-lg
            text-sm
            p-2
          `}
          onClick={() => {
            const book = selectedBook.value.toLowerCase();
            const chapter = Number(selectedChapter.value);
            const verse =
              selectedVerse.value === "All"
                ? undefined
                : Number(selectedVerse.value);
            const q = `?book=${book}&chapter=${chapter}${
              verse ? `&verse=${verse}` : ""
            }`;

            router.push(`/${q}`, { shallow: true });
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
