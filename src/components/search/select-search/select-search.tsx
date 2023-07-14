import { ValidBookName, verseCountFrom } from "kingjames";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
import BookSelect from "./book-select";
import { BookOption } from "./types";
import { getBookOptionFromBook } from "./book-select/book-filter";
import { KeyValueItem } from "@/components/shared/combobox";
import ChapterSelect from "./chapter-select";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";

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
  const selectedBookOption = getBookOptionFromBook(
    book ?? ("Genesis" as ValidBookName)
  );
  const [selectedBook, setSelectedBook] = useState<BookOption>({
    key: selectedBookOption.key,
    value: selectedBookOption.value,
  });
  const [bookQuery, setBookQuery] = useState<string>("");

  // Chapter
  const selectedChapterOption = chapter ?? 1;
  const [selectedChapter, setSelectedChapter] = useState<KeyValueItem>({
    key: selectedChapterOption,
    value: String(selectedChapterOption),
  });
  const [chapterQuery, setChapterQuery] = useState<string>("");

  // Verse
  const [activeVerse, setActiveVerse] = useState<OptionVerse>({
    key: verse
      ? `${selectedBook} ${selectedChapter}:${verse}`
      : `${selectedBook} 0`,
    value: `${verse ?? "All"}`,
  });

  function onVerseChange(event: ChangeEvent<HTMLSelectElement>) {
    setActiveVerse({
      key: `${selectedBook} ${selectedChapter}:${event.target.value}`,
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
      <div className="mr-1 w-24">
        <ChapterSelect
          selectedBook={selectedBook.value}
          selectedChapter={selectedChapter}
          setSelectedChapter={setSelectedChapter}
          query={chapterQuery}
          setQuery={setChapterQuery}
        />
      </div>

      <div className="relative mt-1 mr-1">
        <div
          className={`
        relative
        overflow-hidden
        rounded-lg
        bg-white
        shadow-md
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-white
        focus-visible:ring-opacity-75
        focus-visible:ring-offset-2
        focus-visible:ring-offset-teal-300
        sm:text-sm`}
        >
          <select
            value={activeVerse.value}
            onChange={onVerseChange}
            //className="bg-stone-600 text-white border border-gray-300 focus:ring-gray-300 focus:border-gray-300 rounded-lg text-sm p-2"
            className={`
                      w-full
            border-none
            py-2
            pl-3
            pr-10
            text-sm
            leading-5
          text-slate-900
            focus:ring-0
          `}
          >
            {pipe(
              verseCountFrom(
                selectedBook.value.toLowerCase() as ValidBookName,
                Number(selectedChapter.value)
              ),
              O.map((vc) => A.makeBy(vc, (i) => i + 1)),
              O.map((verses) =>
                pipe(
                  verses,
                  A.map((v) => (
                    <option
                      key={`${selectedBook.value} ${selectedChapter.value}:${v}`}
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
      </div>

      <div className="border-5 mr-2">
        <button
          type="submit"
          className="text-white bg-stone-500 hover:bg-stone-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm p-2"
          onClick={() => {
            const book = selectedBook.value.toLowerCase();
            const chapter = Number(selectedChapter.value);
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
