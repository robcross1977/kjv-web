import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { getPrevious } from "kingjames";
import * as O from "fp-ts/Option";
import { ChevronLeft } from "lucide-react";

function getParams(searchParams: ReadonlyURLSearchParams) {
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");
  const verse = searchParams.get("verse");

  return { book, chapter, verse };
}

function getPreviousParams(searchParams: ReadonlyURLSearchParams) {
  const { book, chapter, verse } = getParams(searchParams);
  return getPrevious(book, chapter, verse);
}

export default function PrevButton() {
  const searchParams = useSearchParams();
  const previous = getPreviousParams(searchParams);
  const router = useRouter();

  return O.isSome(previous) ? (
    <button
      type="button"
      className="group bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 border-2 border-primary/30 hover:border-primary/50 text-primary hover:text-primary font-medium rounded-xl p-3 inline-flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      onClick={() => router.push(`/?${previous.value}`)}
      aria-label="Go to previous chapter or verse"
    >
      <ChevronLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span className="hidden sm:inline text-sm font-semibold">Previous</span>
    </button>
  ) : (
    // Placeholder to maintain layout spacing
    <div className="w-[88px] sm:w-[108px]"></div>
  );
}
