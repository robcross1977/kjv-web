import VerseDisplay from "./verse";
import { ChapterRecords, ValidBookName, VerseRecords } from "kingjames";
import { pipe } from "fp-ts/function";
import { Ord, contramap } from "fp-ts/Ord";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as R from "fp-ts/Record";
import { useState } from "react";
import React from "react";

// Types
type ChapterElement = [string, React.JSX.Element];
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
  const [show, _setShow] = useState(false);

  return (
    <div key={`${book} ${chapter}`}>
      <VerseDisplay book={book} chapter={chapter} verses={verses} show={show} />
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
      <ChaptersContainer
        key={`${book} ${chapter}`}
        book={book}
        chapter={chapter}
        verses={verses}
      />
    )),
    R.toArray,
    A.sort(byChapterRecord),
    A.map(([_chapter, element]) => element)
  );
}
