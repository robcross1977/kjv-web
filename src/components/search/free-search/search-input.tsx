import { RefObject } from "react";
import MagnifyingGlass from "../../shared/magnifying-glass";

function SearchIcon() {
  return (
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <MagnifyingGlass />
    </div>
  );
}

function SearchInput({
  query,
  handleKeyDown,
}: {
  query: RefObject<HTMLInputElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type="search"
      id="default-search"
      className="block w-full p-4 pl-10 text-sm bg-stone-600 text-white border border-gray-300 rounded-lg  focus:ring-gray-300 focus:border-gray-300"
      placeholder="Ex: Gen 1:2-3"
      required
      ref={query}
      onKeyDown={handleKeyDown}
    />
  );
}

function SearchButton({ doSearch }: { doSearch: () => void }) {
  return (
    <button
      type="submit"
      className="text-white absolute right-2.5 bottom-2.5 bg-stone-500 hover:bg-stone-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm px-4 py-2"
      onClick={doSearch}
    >
      Search
    </button>
  );
}

export default function Search({
  query,
  doSearch,
  handleKeyDown,
}: {
  query: RefObject<HTMLInputElement>;
  doSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex-grow w-full sm:w-auto">
      <div className="relative mx-5">
        <SearchIcon />

        <SearchInput query={query} handleKeyDown={handleKeyDown} />

        <SearchButton doSearch={doSearch} />
      </div>
    </div>
  );
}
