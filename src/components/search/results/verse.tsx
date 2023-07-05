import { ValidBookName, VerseRecords } from "kingjames";
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
type TitleDisplayProps = {
  verse: string;
};
function TitleDisplay({ verse }: TitleDisplayProps) {
  return (
    <div>
      <p className="text-red-950 mr-4">{verse}</p>
    </div>
  );
}

type TextDisplayProps = {
  text: string;
};
function TextDisplay({ text }: TextDisplayProps) {
  return <div>{text}</div>;
}

type VersesContainerProps = {
  book: ValidBookName;
  chapter: string;
  verse: string;
  text: string;
};
function VersesContainer({ book, chapter, verse, text }: VersesContainerProps) {
  return (
    <div key={`${book} ${chapter}:${verse}`} className="my-4 flex flex-row">
      <TitleDisplay verse={verse} />
      <TextDisplay text={text} />
    </div>
  );
}

// Main Component
type Props = {
  book: ValidBookName;
  chapter: string;
  verses: VerseRecords;
};
export default function VersesDisplay({ book, chapter, verses }: Props) {
  return pipe(
    verses,
    R.mapWithIndex((verse, text) => (
      <VersesContainer
        book={book}
        chapter={chapter}
        verse={verse}
        text={text}
      />
    )),
    R.toArray,
    A.sort(byVerseRecord),
    A.map(([verse, element]) => {
      return { ...element, key: `${book} ${chapter}:${verse}` };
    })
  );
}
