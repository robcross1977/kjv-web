import { BookRecords, search } from "kingjames";
import { useState } from "react";
import SearchDisplay from "./search-display";

export default function FreeSearch() {
  const [results, setResults] = useState<BookRecords>();
  const [query, setQuery] = useState<string>("");

  function doSearch() {
    const result = search(query);
    setResults(result);
  }

  return (
    <div className="flex flex-col w-10/12 mx-auto my-5 h-screen">
      <div className="flex flex-row w-full py-5 bg-yellow-600 rounded-lg my-3 justify-start">
        <input
          type="text"
          id="query"
          className="mr-3 ml-3 bg-gray-50 w-2/12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Genesis 1:1"
          required
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={doSearch}
          className="text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Search
        </button>
      </div>

      <div className="flex flex-grow bg-parchment rounded-lg py-2.5 px-5 mr-2 mb-2">
        <SearchDisplay book={results} />
      </div>
    </div>
  );
}
