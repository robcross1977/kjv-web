import ChaptersDisplay from "./chapter";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";
import { ChapterRecords, ValidBookName, WrappedRecords } from "kingjames";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import PrevButton from "./prev-button";
import NextButton from "./next-button";

const isDirtyPredicate = (isDirty: boolean | undefined = false) =>
  isDirty === true;

const bookExistsPredicate = (b: WrappedRecords | undefined) =>
  b !== undefined && Object.keys(b.records).length > 0;

// Helper Components
type ResultDisplayProps = {
  results: WrappedRecords;
};
function ResultDisplay({ results }: ResultDisplayProps) {
  return <div className="w-full">{displayTopLevelBookRecords(results)}</div>;
}

function NoResultsFoundResult() {
  return <div>No Result Found</div>;
}

function EmptyResult() {
  return <></>;
}

type BookContainerProps = {
  title: ValidBookName;
  chapters: ChapterRecords;
};
function BookContainer({ title, chapters }: BookContainerProps) {
  return (
    <div key={title} className="flex flex-col w-full h-full text-slate-950 ">
      <TitleDisplay title={title} />
      <ChaptersDisplay book={title} chapters={chapters} />
      <div className="w-full flex justify-between">
        <PrevButton />
        <NextButton />
      </div>
    </div>
  );
}

type TitleProps = {
  title: string;
};
function TitleDisplay({ title }: TitleProps) {
  return (
    <div className="w-full flex flex-row justify-between">
      <PrevButton />
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">
        {capitalizeFirstAlphabeticCharacter(title)}
      </h1>
      <NextButton />
    </div>
  );
}

// Controller Logic
function mapSingleBookRecord(title: ValidBookName, chapters: ChapterRecords) {
  return <BookContainer title={title} chapters={chapters} />;
}

function displayTopLevelBookRecords(results: WrappedRecords) {
  return pipe(
    results.records,
    R.mapWithIndex((title, chapters) =>
      mapSingleBookRecord(title as ValidBookName, chapters)
    ),
    R.toArray,
    A.map(([book, element]) => {
      return { ...element, key: book };
    })
  );
}

function getResultDisplayFromBooks(results: WrappedRecords) {
  return O.of(<ResultDisplay results={results} />);
}

function getNoResultsFoundFromBooks(isDirty: boolean, bookExists: boolean) {
  return pipe(
    isDirty && !bookExists,
    O.fromPredicate((b) => b),
    O.map(() => pipe(NoResultsFoundResult()))
  );
}

function getFinalResultDisplay(
  results: WrappedRecords,
  isDirty: boolean,
  bookExists: boolean
) {
  return pipe(
    bookExists,
    O.fromPredicate((b) => b),
    O.chain((_) => getResultDisplayFromBooks(results)),
    O.alt(() => getNoResultsFoundFromBooks(isDirty, bookExists))
  );
}

// Main Component
type Props = {
  results?: WrappedRecords;
  isDirty?: boolean;
};
export default function BooksDisplay({ results, isDirty }: Props) {
  return pipe(
    O.Do,
    O.apS("isDirty", pipe(isDirty, isDirtyPredicate, O.of)),
    O.apS("bookExists", pipe(results, bookExistsPredicate, O.of)),
    O.chain(({ isDirty, bookExists }) =>
      getFinalResultDisplay(results as WrappedRecords, isDirty, bookExists)
    ),
    O.getOrElse(() => EmptyResult())
  );
}
