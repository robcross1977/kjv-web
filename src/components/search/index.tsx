import BooksDisplay from "./results";
import { ValidBookName, WrappedRecords } from "kingjames";
import SearchBar from "./search-bar";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
  results?: WrappedRecords;
};
export default function Search({ book, chapter, verse, results }: Props) {
  return (
    <div className="flex flex-col w-full mx-auto h-screen">
      <div className="w-2/3 mx-auto">
        <SearchBar book={book} chapter={chapter} verse={verse} />
      </div>

      <div className="flex flex-grow w-full bg-sky-200 pt-2">
        <div className="w-2/3 mx-auto">
          <BooksDisplay results={results} />
        </div>
      </div>
    </div>
  );
}
