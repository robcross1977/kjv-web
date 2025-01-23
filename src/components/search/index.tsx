import { SearchSheet } from "@/app/search-sheet";
import BooksDisplay from "./results";
import { ValidBookName, WrappedRecords } from "kingjames";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
  results?: WrappedRecords;
};
export default function Search({ book, chapter, verse, results }: Props) {
  return (
    <div className="flex flex-col w-full mx-auto h-screen">
      <div className="flex flex-grow w-full pt-2">
        <div className="w-11/12 lg:w-2/3 mx-auto">
          <div className="self-end">
            <SearchSheet book={book} chapter={chapter} verse={verse} />
          </div>
          <BooksDisplay results={results} />
        </div>
      </div>
    </div>
  );
}
