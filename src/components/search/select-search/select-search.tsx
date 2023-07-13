import { ValidBookName, chapterCountFrom, verseCountFrom } from "kingjames";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
import BookSelect, { getBookOptionFromBook } from "./book-select";
import { BookOption, bookOptions } from "./types";

type OptionChapter = {
  key: string;
  value: string;
};

type OptionVerse = {
  key: string;
  value: string;
};

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
};
export default function SelectSearch({ book, chapter, verse }: Props) {
  const router = useRouter();

  // Book State
  const selectedBookOption = getBookOptionFromBook(book ?? "genesis");
  const [selectedBook, setSelectedBook] = useState<BookOption>({
    key: selectedBookOption.key,
    value: selectedBookOption.value,
  });
  const [bookQuery, setBookQuery] = useState("");

  // Chapter
  const [activeChapter, setActiveChapter] = useState<OptionChapter>({
    key: `${selectedBook} ${chapter ?? 1}`,
    value: `${chapter ?? 1}`,
  });

  // Verse
  const [activeVerse, setActiveVerse] = useState<OptionVerse>({
    key: verse
      ? `${selectedBook} ${activeChapter}:${verse}`
      : `${selectedBook} 0`,
    value: `${verse ?? "All"}`,
  });

  function onChapterChange(event: ChangeEvent<HTMLSelectElement>) {
    setActiveChapter({
      key: `${selectedBook} ${event.target.value}`,
      value: event.target.value,
    });
    setActiveVerse({ key: `${selectedBook} 0`, value: "All" });
  }

  function onVerseChange(event: ChangeEvent<HTMLSelectElement>) {
    setActiveVerse({
      key: `${selectedBook} ${activeChapter}:${event.target.value}`,
      value: event.target.value,
    });
  }

  return (
    <div className="flex flex-row justify-start items-center">
      <div className="mr-1">
        <BookSelect
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          query={bookQuery}
          setQuery={setBookQuery}
        />
      </div>
      <div className="mx-1">
        <select
          value={activeChapter.value}
          onChange={onChapterChange}
          className="bg-stone-600 text-white border border-gray-300 focus:ring-gray-300 focus:border-gray-300 rounded-lg text-sm p-2"
        >
          {pipe(
            A.makeBy(
              chapterCountFrom(
                selectedBook.value.toLowerCase() as ValidBookName
              ),
              (i) => i + 1
            ),
            A.map((ch) => (
              <option key={`${selectedBook.value} ${ch}`}>{ch}</option>
            ))
          )}
        </select>
      </div>
      <div className="ml-1 mr-2">
        <select
          value={activeVerse.value}
          onChange={onVerseChange}
          className="bg-stone-600 text-white border border-gray-300 focus:ring-gray-300 focus:border-gray-300 rounded-lg text-sm p-2"
        >
          {pipe(
            verseCountFrom(
              selectedBook.value.toLowerCase() as ValidBookName,
              Number(activeChapter.value)
            ),
            O.map((vc) => A.makeBy(vc, (i) => i + 1)),
            O.map((verses) =>
              pipe(
                verses,
                A.map((v) => (
                  <option
                    key={`${selectedBook.value} ${activeChapter.value}:${v}`}
                  >
                    {v}
                  </option>
                ))
              )
            ),
            O.map((verses) => [
              <option key={`${selectedBook} 0`} value="All">
                All
              </option>,
              ...verses,
            ]),
            O.getOrElse<JSX.Element[]>(() => [])
          )}
        </select>
      </div>
      <div className="border-5 mr-2">
        <button
          type="submit"
          className="text-white bg-stone-500 hover:bg-stone-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm p-2"
          onClick={() => {
            const book = selectedBook.value.toLowerCase();
            const chapter = Number(activeChapter.value);
            const verse =
              activeVerse.value === "All"
                ? undefined
                : Number(activeVerse.value);
            const q = `?book=${book}&chapter=${chapter}${
              verse ? `&verse=${verse}` : ""
            }`;

            router.push(`/${q}`);
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}
