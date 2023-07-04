import { WrappedRecords } from "kingjames";
import { useState } from "react";
import SelectSearch from "./select-search";
import SearchType from "./search-type";
import BooksDisplay from "./search-results";

type Props = {
  query?: string;
  book?: string;
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
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<"Basic" | "Advanced">("Basic");
  const [activeQuery, setActiveQuery] = useState(
    book && book.length > 0 ? undefined : query ?? ""
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
      <div className="flex flex-row w-full pb-3 bg-sky-950 border-l-2 border-amber-100 rounded-b-lg items-start">
        {searchType === "Advanced" ? (
          <></>
        ) : (
          <SelectSearch book={book} chapter={chapter} verse={verse} />
        )}
      </div>

      <div>
        <SearchType searchType={searchType} onOptionChange={onOptionChange} />
      </div>

      <div className="flex flex-grow w-full bg-sky-200 rounded-lg py-2.5 px-5 mr-2  border border-zinc-950 shadow-2xl">
        <BooksDisplay book={results} isDirty={isDirty} />
      </div>
    </div>
  );
}
