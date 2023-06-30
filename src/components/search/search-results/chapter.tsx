import { ChapterRecords, VerseRecords } from "kingjames";
import VerseDisplay from "./verse";
import { pipe } from "fp-ts/function";
import { Ord, contramap } from "fp-ts/Ord";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as R from "fp-ts/Record";

// Types
type ChapterElement = [string, JSX.Element];

const byChapterRecord: Ord<ChapterElement> = contramap(
  (element: ChapterElement) => Number(element[0])
)(N.Ord);

// Helper Components
function ChaptersContainer(
  book: string,
  chapter: string,
  verses: VerseRecords
) {
  return (
    <div key={`${book}${chapter}`}>
      {TitleDisplay(chapter)}
      {VerseDisplay({ book, chapter, verses })}
    </div>
  );
}

function TitleDisplay(chapter: string) {
  return <h3 className="text-2xl font-semibold mt-5">Chapter {chapter}</h3>;
}

// Main Component
export default function ChaptersDisplay(
  book: string,
  chapters: ChapterRecords
) {
  return pipe(
    chapters,
    R.mapWithIndex((chapter, verses) =>
      ChaptersContainer(book, chapter, verses)
    ),
    R.toArray,
    A.sort(byChapterRecord),
    A.map(([_, element]) => element)
  );
}
