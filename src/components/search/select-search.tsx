import { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  orderedBookNames,
  chapterCountFrom,
  verseCountFrom,
  ValidBookName,
} from "kingjames";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import SearchButton from "./search-button";
import { OptionBook, OptionChapter, OptionVerse } from "./index";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";

type Props = {
  activeBook: OptionBook;
  setActiveBook: Dispatch<SetStateAction<OptionBook>>;
  activeChapter: OptionChapter;
  setActiveChapter: Dispatch<SetStateAction<OptionChapter>>;
  activeVerse: OptionVerse;
  setActiveVerse: Dispatch<SetStateAction<OptionVerse>>;
  doSearch: () => void;
};
export default function SelectSearch({
  activeBook,
  setActiveBook,
  activeChapter,
  setActiveChapter,
  activeVerse,
  setActiveVerse,
  doSearch,
}: Props) {
  function onBookChange(event: ChangeEvent<HTMLSelectElement>) {
    setActiveBook({
      key: event.target.value as ValidBookName,
      value: event.target.value as ValidBookName,
    });
    setActiveChapter({ key: `${event.target.value}1`, value: "1" });
    setActiveVerse({ key: `${event.target.value}0`, value: "All" });
  }

  function onChapterChange(event: ChangeEvent<HTMLSelectElement>) {
    setActiveChapter({
      key: `${activeBook}${event.target.value}`,
      value: event.target.value,
    });
    setActiveVerse({ key: `${activeBook}${event.target.value}`, value: "All" });
  }

  function onVerseChange(event: ChangeEvent<HTMLSelectElement>) {
    setActiveVerse({
      key: `${activeBook}${activeChapter}:${event.target.value}`,
      value: event.target.value,
    });
  }

  return (
    <div className="flex flex-row justify-start items-center">
      <div className="ml-2 mr-1">
        <select
          value={activeBook.value}
          onChange={onBookChange}
          className="bg-stone-600 text-white border border-gray-300 focus:ring-gray-300 focus:border-gray-300 rounded-lg text-sm p-2"
        >
          {orderedBookNames.map((b) => {
            return (
              <option key={b}>
                {pipe(
                  b,
                  capitalizeFirstAlphabeticCharacter,
                  O.getOrElse(() => "")
                )}
              </option>
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
              <option key={`${activeBook.value}${ch}`}>{ch}</option>
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
                  <option key={`${activeBook.value}${activeChapter.value}${v}`}>
                    {v}
                  </option>
                ))
              )
            ),
            O.map((verses) => [
              <option key={`${activeBook}0`} value="All">
                All
              </option>,
              ...verses,
            ]),
            O.getOrElse<JSX.Element[]>(() => [])
          )}
        </select>
      </div>
      <div className="border-5 mr-2">
        <SearchButton doSearch={doSearch} />
      </div>
    </div>
  );
}
