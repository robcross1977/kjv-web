import { BookRecords, search } from "kingjames";
import { useEffect, useRef, useState } from "react";
import BookDisplay from "../search-results/book";
import Search from "./search-input";
import { pipe } from "fp-ts/function";

export default function FreeSearch() {
  const [results, setResults] = useState<BookRecords>();
  const query = useRef<HTMLInputElement>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (results) {
      setIsDirty(true);
    }
  }, [results]);

  function doSearch() {
    return pipe(query.current?.value ?? "", search, setResults);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      doSearch();
    }
  }

  return (
    <div className="flex flex-col w-full mx-auto h-screen">
      <div className="flex flex-col w-full sm:flex-row pb-3 bg-sky-950 border-l-2 border-amber-100 rounded-b-lg justify-between items-center">
        <Search
          query={query}
          doSearch={doSearch}
          handleKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex flex-grow w-full bg-parchment rounded-lg py-2.5 px-5 mr-2 my-2 border border-zinc-950 shadow-2xl">
        <BookDisplay book={results} isDirty={isDirty} />
      </div>
    </div>
  );
}
