import {
  ValidBookName,
  WrappedRecords,
  orderedBookNames,
  search,
} from "kingjames";
import { useEffect, useRef, useState } from "react";
import BookDisplay from "./search-results";
import FreeSearch from "./free-search";
import SelectSearch from "./select-search";
import { pipe } from "fp-ts/function";
import SearchType from "./search-type";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";
import * as O from "fp-ts/Option";

export type OptionBook = {
  key: ValidBookName;
  value: string;
};

export type OptionChapter = {
  key: string;
  value: string;
};

export type OptionVerse = {
  key: string;
  value: string;
};

export default function Search() {
  const [results, setResults] = useState<WrappedRecords>();
  const query = useRef<HTMLInputElement>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<"Basic" | "Advanced">("Basic");
  const [activeBook, setActiveBook] = useState<OptionBook>({
    key: orderedBookNames[0],
    value: pipe(
      orderedBookNames[0],
      capitalizeFirstAlphabeticCharacter,
      O.getOrElse(() => "")
    ),
  });
  const [activeChapter, setActiveChapter] = useState<OptionChapter>({
    key: `${activeBook}1`,
    value: "1",
  });
  const [activeVerse, setActiveVerse] = useState<OptionVerse>({
    key: `${activeBook}0`,
    value: "All",
  });

  useEffect(() => {
    if (results) {
      setIsDirty(true);
    }
  }, [results]);

  const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value === "Basic" || e.target.value === "Advanced"
        ? e.target.value
        : "Basic";

    setSearchType(value);
  };

  function doBasicSearch() {
    return pipe(
      O.Do,
      O.apS("book", O.some(activeBook.value)),
      O.apS("chapter", O.some(activeChapter.value)),
      O.apS(
        "verse",
        activeVerse.value === "All"
          ? O.some("")
          : O.some(`:${activeVerse.value}`)
      ),
      O.map(({ book, chapter, verse }) => `${book} ${chapter}${verse}`),
      O.map(search),
      O.map(setResults)
    );
  }

  function doAdvancedSearch() {
    return pipe(query.current?.value ?? "", search, setResults);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && searchType === "Advanced") {
      doAdvancedSearch();
    }
  }

  return (
    <div className="flex flex-col w-full mx-auto h-screen">
      <div className="flex flex-row w-full pb-3 bg-sky-950 border-l-2 border-amber-100 rounded-b-lg items-start">
        {searchType === "Advanced" ? (
          <FreeSearch
            query={query}
            doSearch={doAdvancedSearch}
            handleKeyDown={handleKeyDown}
          />
        ) : (
          <SelectSearch
            activeBook={activeBook}
            setActiveBook={setActiveBook}
            activeChapter={activeChapter}
            setActiveChapter={setActiveChapter}
            activeVerse={activeVerse}
            setActiveVerse={setActiveVerse}
            doSearch={doBasicSearch}
          />
        )}
      </div>

      <div>
        <SearchType searchType={searchType} onOptionChange={onOptionChange} />
      </div>

      <div className="flex flex-grow w-full bg-sky-200 rounded-lg py-2.5 px-5 mr-2  border border-zinc-950 shadow-2xl">
        <BookDisplay book={results} isDirty={isDirty} />
      </div>
    </div>
  );
}
