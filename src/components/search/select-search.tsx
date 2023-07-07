import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";
import {
  ValidBookName,
  chapterCountFrom,
  orderedBookNames,
  verseCountFrom,
} from "kingjames";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";

type OptionBook = {
  key: ValidBookName;
  value: string;
};

type OptionChapter = {
  key: string;
  value: string;
};

type OptionVerse = {
  key: string;
  value: string;
};

type Props = {
  book?: string;
  chapter?: number;
  verse?: number;
};

export default function SelectSearch({ book, chapter, verse }: Props) {
  const router = useRouter();

  const [activeBook, setActiveBook] = useState<OptionBook>({
    key: (book as ValidBookName) ?? "genesis",
    value: book ?? "Genesis",
  });

  const [activeChapter, setActiveChapter] = useState<OptionChapter>({
    key: `${activeBook} ${chapter ?? 1}`,
    value: `${chapter ?? 1}`,
  });

  const [activeVerse, setActiveVerse] = useState<OptionVerse>({
    key: verse ? `${activeBook} ${activeChapter}:${verse}` : `${activeBook} 0`,
    value: `${verse ?? "All"}`,
  });

  function onBookChange(event: ChangeEvent<HTMLSelectElement>) {
    setActiveBook({
      key: event.target.value as ValidBookName,
      value: event.target.value as ValidBookName,
    });
    setActiveChapter({ key: `${event.target.value} 1`, value: "1" });
    setActiveVerse({ key: `${event.target.value} 0`, value: "All" });
  }

  function onChapterChange(event: ChangeEvent<HTMLSelectElement>) {
    setActiveChapter({
      key: `${activeBook} ${event.target.value}`,
      value: event.target.value,
    });
    setActiveVerse({ key: `${activeBook} 0`, value: "All" });
  }

  function onVerseChange(event: ChangeEvent<HTMLSelectElement>) {
    setActiveVerse({
      key: `${activeBook} ${activeChapter}:${event.target.value}`,
      value: event.target.value,
    });
  }

  return (
    <div className="flex flex-row justify-start items-center">
      <div className="mr-1">
        <select
          value={activeBook.value}
          onChange={onBookChange}
          className="bg-stone-600 text-white border border-gray-300 focus:ring-gray-300 focus:border-gray-300 rounded-lg text-sm p-2"
        >
          {orderedBookNames.map((b) => {
            return (
              <option key={b}>{capitalizeFirstAlphabeticCharacter(b)}</option>
            );
          })}
        </select>
      </div>
      <div className="mx-1">
        <select
          value={activeChapter.value}
          onChange={onChapterChange}
          className="bg-stone-600 text-white border border-gray-300 focus:ring-gray-300 focus:border-gray-300 rounded-lg text-sm p-2"
        >
          {pipe(
            A.makeBy(
              chapterCountFrom(activeBook.value.toLowerCase() as ValidBookName),
              (i) => i + 1
            ),
            A.map((ch) => (
              <option key={`${activeBook.value} ${ch}`}>{ch}</option>
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
              activeBook.value.toLowerCase() as ValidBookName,
              Number(activeChapter.value)
            ),
            O.map((vc) => A.makeBy(vc, (i) => i + 1)),
            O.map((verses) =>
              pipe(
                verses,
                A.map((v) => (
                  <option
                    key={`${activeBook.value} ${activeChapter.value}:${v}`}
                  >
                    {v}
                  </option>
                ))
              )
            ),
            O.map((verses) => [
              <option key={`${activeBook} 0`} value="All">
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
            const book = activeBook.value.toLowerCase();
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
