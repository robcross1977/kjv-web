import { VerseRecords } from "kingjames";
import { pipe } from "fp-ts/function";
import { Ord, contramap } from "fp-ts/Ord";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as R from "fp-ts/Record";

// Types
type VerseElement = [string, JSX.Element];

const byVerseRecord: Ord<VerseElement> = contramap((element: VerseElement) =>
  Number(element[0])
)(N.Ord);

// Helper Components
function TitleDisplay(verse: string) {
  return (
    <div>
      <p className="text-red-950 mr-4">{verse}</p>
    </div>
  );
}

function TextDisplay(text: string) {
  return <div>{text}</div>;
}

function VersesContainer(
  book: string,
  chapter: string,
  verse: string,
  text: string
) {
  return (
    <div key={`${book}${chapter}${verse}`} className="my-4 flex flex-row">
      {TitleDisplay(verse)}
      {TextDisplay(text)}
    </div>
  );
}

// Main Component
export default function VersesDisplay({
  book,
  chapter,
  verses,
}: {
  book: string;
  chapter: string;
  verses: VerseRecords;
}) {
  return pipe(
    verses,
    R.mapWithIndex((verse, text) =>
      VersesContainer(book, chapter, verse, text)
    ),
    R.toArray,
    A.sort(byVerseRecord),
    A.map(([_, element]) => element)
  );
}
