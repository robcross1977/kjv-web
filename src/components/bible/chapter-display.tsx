import { ChapterRecords } from "kingjames";
import VerseDisplay from "./verse-display";

export function ChapterDisplay({
  book,
  chapters,
}: {
  book: string;
  chapters: ChapterRecords;
}) {
  return Object.entries(chapters).map(([chapter, verses]) => {
    return (
      <div key={`${book}${chapter}`}>
        <h3 className="text-2xl font-semibold mt-5">Chapter {chapter}</h3>
        {VerseDisplay({ book, chapter, verses })}
      </div>
    );
  });
}
