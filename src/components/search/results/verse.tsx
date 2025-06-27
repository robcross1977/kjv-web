import React from "react";
import { pipe } from "fp-ts/function";
import { Ord, contramap } from "fp-ts/Ord";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as R from "fp-ts/Record";
import Link from "next/link";
import { ValidBookName, VerseRecords } from "kingjames";
import { SelectableVerse } from "@/components/verse/selectable-verse";
import { ChapterHeader } from "@/components/chapter/chapter-header";
import { useTools } from "@/components/tools/tools-provider";

// Types
type VerseElement = [string, React.JSX.Element];

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
    <div className="mr-4 group">
      <Link
        href={`/?book=${book}&chapter=${chapter}&verse=${verse}`}
        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-200 text-primary hover:text-primary font-semibold"
      >
        {verse}
      </Link>
    </div>
  );
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
  const { isToolsActive, toggleVerseReadStatus, getVerseReadStatus } =
    useTools();

  const chapterNum = parseInt(chapter);
  const verseNum = parseInt(verse);

  return (
    <div key={`${book} ${chapter}:${verse}`} className="my-1">
      <SelectableVerse
        book={book}
        chapter={chapterNum}
        verse={verseNum}
        text={text}
        readStatus={getVerseReadStatus(book, chapterNum, verseNum)}
        isToolsActive={isToolsActive}
        onToggleReadStatus={toggleVerseReadStatus}
      />
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
  const { fetchReadStatus, setCurrentVerses, isToolsActive, markAllAsRead } =
    useTools();

  // Fetch read status and set current verses when component mounts
  React.useEffect(() => {
    const verseNumbers = pipe(
      verses,
      R.keys,
      A.map((v) => parseInt(v))
    );

    if (verseNumbers.length > 0) {
      fetchReadStatus(book, parseInt(chapter), verseNumbers);

      // Set current verses for mark-all functionality
      const currentVerses = verseNumbers.map((verseNum) => ({
        book,
        chapter: parseInt(chapter),
        verse: verseNum,
      }));
      setCurrentVerses(currentVerses);
    }
  }, [book, chapter, verses, fetchReadStatus, setCurrentVerses]);

  const verseElements = pipe(
    verses,
    R.mapWithIndex((verse, text) => (
      <VersesContainer
        key={`${book} ${chapter}:${verse}`}
        book={book}
        chapter={chapter}
        verse={verse}
        text={text}
        show={show}
      />
    )),
    R.toArray,
    A.sort(byVerseRecord),
    A.map(([verse, element]) => element)
  );

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-header/10 via-header/20 to-header/10 rounded-xl p-4 border border-header/30">
        <ChapterHeader
          book={book}
          chapter={parseInt(chapter)}
          isToolsActive={isToolsActive}
          onMarkAllAsRead={markAllAsRead}
        />
      </div>
      <div className="space-y-2">{verseElements}</div>
    </div>
  );
}
