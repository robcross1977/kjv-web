import { VerseRecords } from "kingjames";

export default function VerseDisplay({
  book,
  chapter,
  verses,
}: {
  book: string;
  chapter: string;
  verses: VerseRecords;
}) {
  return Object.entries(verses).map(([verse, text]) => {
    return (
      <div key={`${book}${chapter}${verse}`} className="my-4 flex flex-row">
        <div>
          <p className="text-red-950 mr-4">{verse}</p>
        </div>
        <div className="border border-1">{text}</div>
      </div>
    );
  });
}
