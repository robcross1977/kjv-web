import { useRouter } from "next/navigation";
import { useRef } from "react";

function SearchIcon() {
  return (
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg
        aria-hidden="true"
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
  );
}

type Props = {
  query: string;
};
export default function FreeSearch({ query }: Props) {
  const router = useRouter();
  const newQuery = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-grow w-full mx-2">
      <div className="relative">
        <SearchIcon />

        <input
          type="search"
          id="default-search"
          className="block w-full p-2 pl-10 text-sm bg-stone-600 text-white border border-gray-300 rounded-lg  focus:ring-gray-300 focus:border-gray-300"
          placeholder="Ex: Gen 1:2-3"
          required
          ref={newQuery}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              router.push(`/search?query=${newQuery.current?.value}`);
            }
          }}
        />

        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-1.5 bg-stone-500 hover:bg-stone-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm px-2 py-1"
          onClick={() => {
            router.push(`/search?query=${newQuery.current?.value}`);
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}
