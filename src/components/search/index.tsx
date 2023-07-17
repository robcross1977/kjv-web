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
  const [useAdvancedSearch, setUseAdvanceSearch] = useState(false);

  return (
    <div className="flex flex-col w-full mx-auto h-screen">
      <div className="flex flex-col w-full lg:flex-row lg:justify-between lg:items-center py-1">
        <div className="h-full hidden lg:block">
          {useAdvancedSearch ? (
            <FreeSearch query={query ?? ""} />
          ) : (
            <SelectSearch book={book} chapter={chapter} verse={verse} />
          )}
        </div>
        <div className="h-full lg:hidden">
          <SelectSearch book={book} chapter={chapter} verse={verse} />
        </div>
        <div className="mr-4">
          <SearchType
            enabled={useAdvancedSearch}
            setEnabled={setUseAdvanceSearch}
          />
        </div>
      </div>

      <div className="flex flex-grow w-full bg-sky-200 rounded-lg py-2.5 px-5 mr-2 border border-zinc-950 shadow-2xl">
        <BooksDisplay results={results} />
      </div>
    </div>
  );
}
