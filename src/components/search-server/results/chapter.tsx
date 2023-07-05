import VerseDisplay from "./verse";
import { ChapterRecords, ValidBookName, VerseRecords } from "kingjames";
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
type ChapterContainerProps = {
  book: ValidBookName;
  chapter: string;
  verses: VerseRecords;
};
function ChaptersContainer({ book, chapter, verses }: ChapterContainerProps) {
  return (
    <div key={`${book} ${chapter}`}>
      <TitleDisplay chapter={chapter} />
      <VerseDisplay book={book} chapter={chapter} verses={verses} />
    </div>
  );
}

type TitleDisplayProps = {
  chapter: string;
};
function TitleDisplay({ chapter }: TitleDisplayProps) {
  return <h3 className="text-2xl font-semibold mt-5">Chapter {chapter}</h3>;
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
