import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { getNext } from "kingjames";
import * as O from "fp-ts/Option";

function getParams(searchParams: ReadonlyURLSearchParams) {
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");
  const verse = searchParams.get("verse");

  return { book, chapter, verse };
}

function getNextParams(searchParams: ReadonlyURLSearchParams) {
  const { book, chapter, verse } = getParams(searchParams);
  return getNext(book, chapter, verse);
}

export default function NextButton() {
  const searchParams = useSearchParams();
  const next = getNextParams(searchParams);
  const router = useRouter();

  return O.isSome(next) ? (
    <button
      type="button"
      className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 inline-flex items-center"
      onClick={() => router.push(`/?${next.value}`)}
    >
      <svg
        aria-hidden="true"
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span className="sr-only">Icon description</span>
    </button>
  ) : (
    <div></div>
  );
}
