import { BookRecords, search } from "kingjames";
import { ChangeEvent, KeyboardEventHandler, useState } from "react";
import BookDisplay from "./book-display";
import Title from "./title";
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
    <div className="flex flex-col w-11/12 mx-auto my-5 h-screen">
      <div className="flex flex-col w-full sm:flex-row py-5 bg-yellow-500 rounded-lg my-3 justify-between items-center">
        <Title />

        <Search
          query={query}
          changeQuery={changeQuery}
          doSearch={doSearch}
          handleKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex flex-grow w-full bg-parchment rounded-lg py-2.5 px-5 mr-2 mb-2">
        <BookDisplay book={results} isDirty={isDirty} />
      </div>
    </div>
  );
}
