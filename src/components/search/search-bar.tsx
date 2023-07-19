import { ValidBookName } from "kingjames";
import FreeSearch from "./free-search/free-search";
import SelectSearch from "./select-search";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
};
export default function SearchBar({ book, chapter, verse }: Props) {
  return (
    <div className="flex flex-col w-full lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-10 py-3">
      <div className="w-full">
        <FreeSearch />
      </div>

      <div className="w-full">
        <SelectSearch book={book} chapter={chapter} verse={verse} />
      </div>
    </div>
  );
}
