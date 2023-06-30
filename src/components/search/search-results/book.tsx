import { BookRecords, ChapterRecords } from "kingjames";
import ChaptersDisplay from "./chapter";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";

// Utility Functions
function capitalizeFirstAlphabeticCharacter(str: string) {
  return pipe(
    str.replace(/[a-zA-Z]/, (c) => c.toUpperCase()),
    O.fromPredicate((s) => s.length > 0)
  );
}

const isDirtyPredicate = (isDirty: boolean | undefined = false) =>
  isDirty === true;

const bookExistsPredicate = (b: BookRecords | undefined) =>
  b !== undefined && Object.keys(b).length > 0;

// Helper Components
function ResultDisplay(book: BookRecords) {
  return <div className="w-full">{displayTopLevelBookRecords(book)}</div>;
}

function NoResultsFoundResult() {
  return <div>No Result Found</div>;
}

function EmptyResult() {
  return <></>;
}

function BookContainer(title: string, chapters: ChapterRecords) {
  return (
    <div key={title} className="flex flex-col w-full h-full">
      {TitleDisplay(title)}
      {ChaptersDisplay(title, chapters)}
    </div>
  );
}

function TitleDisplay(title: string) {
  return (
    <h1 className="text-4xl font-semibold mb-5 text-center w-full">{title}</h1>
  );
}

// Controller Logic
function mapSingleBookRecord(title: string, chapters: ChapterRecords) {
  return pipe(
    title,
    capitalizeFirstAlphabeticCharacter,
    O.map((finalTitle) => BookContainer(finalTitle, chapters)),
    O.getOrElse(() => EmptyResult())
  );
}

function displayTopLevelBookRecords(book: BookRecords) {
  return pipe(
    book,
    R.mapWithIndex((title, chapters) => mapSingleBookRecord(title, chapters)),
    R.toArray,
    A.map(([_, element]) => element)
  );
}

function getResultDisplayFromBooks(books: BookRecords) {
  return pipe(books as BookRecords, ResultDisplay, O.of);
}

function getNoResultsFoundFromBooks(isDirty: boolean, bookExists: boolean) {
  return pipe(
    isDirty && !bookExists,
    O.fromPredicate((b) => b),
    O.map(() => pipe(NoResultsFoundResult()))
  );
}

function getFinalResultDisplay(
  books: BookRecords,
  isDirty: boolean,
  bookExists: boolean
) {
  return pipe(
    isDirty && bookExists,
    O.fromPredicate((b) => b),
    O.chain((_) => getResultDisplayFromBooks(books)),
    O.alt(() => getNoResultsFoundFromBooks(isDirty, bookExists))
  );
}

// Main Component
type Props = {
  book?: BookRecords;
  isDirty?: boolean;
};

export default function BooksDisplay({ book, isDirty }: Props) {
  return pipe(
    O.Do,
    O.apS("isDirty", pipe(isDirty, isDirtyPredicate, O.of)),
    O.apS("bookExists", pipe(book, bookExistsPredicate, O.of)),
    O.chain(({ isDirty, bookExists }) =>
      getFinalResultDisplay(book as BookRecords, isDirty, bookExists)
    ),
    O.getOrElse(() => EmptyResult())
  );
}
