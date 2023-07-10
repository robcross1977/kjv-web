import VerseDisplay from "./verse";
import { ChapterRecords, ValidBookName, VerseRecords } from "kingjames";
import { pipe } from "fp-ts/function";
import { Ord, contramap } from "fp-ts/Ord";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as R from "fp-ts/Record";
import Link from "next/link";
import { useState } from "react";

// Types
type ChapterElement = [string, JSX.Element];
const byChapterRecord: Ord<ChapterElement> = contramap(
  (element: ChapterElement) => Number(element[0])
)(N.Ord);

// Helper Components
type ChapterContainerProps = {
  book: ValidBookName;
  chapter: string;
  verses: VerseRecords;
};
function ChaptersContainer({ book, chapter, verses }: ChapterContainerProps) {
  const [show, setShow] = useState(false);

  return (
    <div key={`${book} ${chapter}`}>
      <div className="flex flex-row justify-between items-end">
        <TitleDisplay book={book} chapter={chapter} />
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-zinc-50 font-bold p-1 border border-blue-700 rounded"
            onClick={() => setShow(!show)}
          >
            Show Actions
          </button>
        </div>
      </div>
      <VerseDisplay book={book} chapter={chapter} verses={verses} show={show} />
    </div>
  );
}

type TitleDisplayProps = {
  book: ValidBookName;
  chapter: string;
};
function TitleDisplay({ book, chapter }: TitleDisplayProps) {
  return (
    <div className="mt-5">
      <Link
        className="text-2xl font-semibold text-blue-950 hover:text-blue-500"
        href={`/?book=${book}&chapter=${chapter}`}
      >
        Chapter {chapter}
      </Link>
    </div>
  );
}

// Main Component
type ChapterDisplayProps = {
  book: ValidBookName;
  chapters: ChapterRecords;
};
export default function ChaptersDisplay({
  book,
  chapters,
}: ChapterDisplayProps) {
  return pipe(
    chapters,
    R.mapWithIndex((chapter, verses) => (
      <ChaptersContainer book={book} chapter={chapter} verses={verses} />
    )),
    R.toArray,
    A.sort(byChapterRecord),
    A.map(([chapter, element]) => {
      return { ...element, key: `${book} ${chapter}` };
    })
  );
}
