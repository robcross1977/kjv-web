import { ValidBookName, VerseRecords } from "kingjames";
import { pipe } from "fp-ts/function";
import { Ord, contramap } from "fp-ts/Ord";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as R from "fp-ts/Record";
import Link from "next/link";

// Types
type VerseElement = [string, JSX.Element];
const byVerseRecord: Ord<VerseElement> = contramap((element: VerseElement) =>
  Number(element[0])
)(N.Ord);

// Helper Components
type TitleDisplayProps = {
  book: ValidBookName;
  chapter: string;
  verse: string;
};
function TitleDisplay({ book, chapter, verse }: TitleDisplayProps) {
  return (
    <div className="mr-4">
      <Link
        className="text-red-950 hover:text-red-500"
        href={`/?book=${book}&chapter=${chapter}&verse=${verse}`}
      >
        {verse}
      </Link>
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
  show: boolean;
};
function VersesContainer({
  book,
  chapter,
  verse,
  text,
  show,
}: VersesContainerProps) {
  return (
    <div
      key={`${book} ${chapter}:${verse}`}
      className={`my-4 flex flex-row  ${
        show ? `border border-5 border-sky-400` : ``
      }`}
    >
      <input type="checkbox" className={`${show ? `mx-3` : "invisible"}`} />
      <TitleDisplay book={book} chapter={chapter} verse={verse} />
      <TextDisplay text={text} />
    </div>
  );
}

// Main Component
type Props = {
  book: ValidBookName;
  chapter: string;
  verses: VerseRecords;
  show: boolean;
};
export default function VersesDisplay({
  book,
  chapter,
  verses,
  show = false,
}: Props) {
  return pipe(
    verses,
    R.mapWithIndex((verse, text) => (
      <VersesContainer
        book={book}
        chapter={chapter}
        verse={verse}
        text={text}
        show={show}
      />
    )),
    R.toArray,
    A.sort(byVerseRecord),
    A.map(([verse, element]) => {
      return { ...element, key: `${book} ${chapter}:${verse}` };
    })
  );
}
