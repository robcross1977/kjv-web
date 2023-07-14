import FreeSearch from "./free-search/free-search";
import BooksDisplay from "./results";
import SearchType from "./search-type";
import SelectSearch from "./select-search";
import { ValidBookName, WrappedRecords } from "kingjames";
import { useState } from "react";

type Props = {
  query?: string;
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
  results?: WrappedRecords;
};
export default function Search({
  query,
  book,
  chapter,
  verse,
  results,
}: Props) {
  const [searchType, setSearchType] = useState<"Basic" | "Advanced">(
    (book && book.trim().length > 0) ||
      query === undefined ||
      query.trim().length === 0
      ? "Basic"
      : "Advanced"
  );

  const [isDirty, _setIsDirty] = useState<boolean>(
    searchType === "Advanced" && results !== undefined
  );

  const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value === "Basic" || e.target.value === "Advanced"
        ? e.target.value
        : "Basic";

    setSearchType(value);
  };

  return (
    <div className="flex flex-col w-full mx-auto h-screen">
      <div className="flex flex-col w-full lg:flex-row lg:justify-between lg:items-center py-1">
        <div className="h-full">
          {searchType === "Advanced" ? (
            <FreeSearch query={query ?? ""} />
          ) : (
            <SelectSearch book={book} chapter={chapter} verse={verse} />
          )}
        </div>
        <div>
          <SearchType searchType={searchType} onOptionChange={onOptionChange} />
        </div>
      </div>

      <div className="flex flex-grow w-full bg-sky-200 rounded-lg py-2.5 px-5 mr-2 border border-zinc-950 shadow-2xl">
        <BooksDisplay results={results} isDirty={isDirty} />
      </div>
    </div>
  );
}
