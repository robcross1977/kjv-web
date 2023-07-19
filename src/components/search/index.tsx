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
      <SearchBar book={book} chapter={chapter} verse={verse} />

      <div className="flex flex-grow w-full bg-sky-200 rounded-lg py-2.5 px-5 mr-2 border border-zinc-950 shadow-2xl">
        <BooksDisplay results={results} />
      </div>
    </div>
  );
}
