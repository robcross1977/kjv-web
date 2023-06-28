import { BookRecords, search } from "kingjames";
import { ChangeEvent, useState } from "react";
import BookDisplay from "./book-display";
import Search from "./search";

export default function FreeSearch() {
  const [results, setResults] = useState<BookRecords>();
  const [query, setQuery] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);

  function doSearch() {
    const result = search(query);
    setResults(result);
    setIsDirty(true);
  }

  function changeQuery(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      doSearch();
    }
  }

  return (
    <div className="flex flex-col w-full mx-auto h-screen">
      <div className="flex flex-col w-full sm:flex-row pb-3 bg-violet-950 border-l-2 border-amber-100 rounded-b-lg justify-between items-center">
        <Search
          query={query}
          changeQuery={changeQuery}
          doSearch={doSearch}
          handleKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex flex-grow w-full bg-parchment rounded-lg py-2.5 px-5 mr-2 my-1">
        <BookDisplay book={results} isDirty={isDirty} />
      </div>
    </div>
  );
}
