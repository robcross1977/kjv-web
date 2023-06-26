import { ChangeEvent, KeyboardEventHandler } from "react";
import MagnifyingGlass from "../shared/magnifying-glass";
export default function Search({
  query,
  changeQuery,
  doSearch,
  handleKeyDown,
}: {
  query: string;
  changeQuery: (e: ChangeEvent<HTMLInputElement>) => void;
  doSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex-grow">
      <div className="relative mx-5">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlass />
        </div>

        <input
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm bg-lime-950 text-white border border-gray-300 rounded-lg  focus:ring-gray-300 focus:border-gray-300"
          placeholder="Ex: Genesis 1:2-5"
          required
          value={query}
          onChange={changeQuery}
          onKeyDown={handleKeyDown}
        />

        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-stone-500 hover:bg-stone-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm px-4 py-2"
          onClick={doSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
