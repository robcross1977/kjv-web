import { ChapterRecords, WrappedRecords } from "kingjames";
import ChaptersDisplay from "./chapter";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";

const isDirtyPredicate = (isDirty: boolean | undefined = false) =>
  isDirty === true;

const bookExistsPredicate = (b: WrappedRecords | undefined) =>
  b !== undefined && Object.keys(b.records).length > 0;

// Helper Components
type ResultDisplayProps = {
  book: WrappedRecords;
};

function ResultDisplay({ book }: ResultDisplayProps) {
  return <div className="w-full">{displayTopLevelBookRecords(book)}</div>;
}

function NoResultsFoundResult() {
  return <div>No Result Found</div>;
}

function EmptyResult() {
  return <></>;
}

type BookContainerProps = {
  title: string;
  chapters: ChapterRecords;
};

function BookContainer({ title, chapters }: BookContainerProps) {
  return (
    <div className="flex flex-col w-full h-full text-slate-950 ">
      <TitleDisplay title={title} />
      <ChaptersDisplay book={title} chapters={chapters} />
      <div className="w-full flex justify-between">
        <PrevButton />
        <NextButton />
      </div>
    </div>
  );
}

function PrevButton() {
  return (
    <button
      type="button"
      className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
    >
      <svg
        aria-hidden="true"
        className="w-5 h-5 rotate-180"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span className="sr-only">Icon description</span>
    </button>
  );
}

function NextButton() {
  return (
    <button
      type="button"
      className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
    >
      <svg
        aria-hidden="true"
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span className="sr-only">Icon description</span>
    </button>
  );
}

type TitleProps = {
  title: string;
};
function TitleDisplay({ title }: TitleProps) {
  return (
    <div className="w-full flex flex-row justify-between">
      <PrevButton />
      <h1 className="text-4xl font-semibold mb-2">{title}</h1>
      <NextButton />
    </div>
  );
}

// Controller Logic
function mapSingleBookRecord(title: string, chapters: ChapterRecords) {
  return (
    <BookContainer
      key={title}
      title={capitalizeFirstAlphabeticCharacter(title)}
      chapters={chapters}
    />
  );
}

function displayTopLevelBookRecords(book: WrappedRecords) {
  return pipe(
    book.records,
    R.mapWithIndex((title, chapters) => mapSingleBookRecord(title, chapters)),
    R.toArray,
    A.map(([_, element]) => element)
  );
}

function getResultDisplayFromBooks(books: WrappedRecords) {
  return O.of(<ResultDisplay book={books} />);
}

function getNoResultsFoundFromBooks(isDirty: boolean, bookExists: boolean) {
  return pipe(
    isDirty && !bookExists,
    O.fromPredicate((b) => b),
    O.map(() => pipe(NoResultsFoundResult()))
  );
}

function getFinalResultDisplay(
  books: WrappedRecords,
  isDirty: boolean,
  bookExists: boolean
) {
  return pipe(
    bookExists,
    O.fromPredicate((b) => b),
    O.chain((_) => getResultDisplayFromBooks(books)),
    O.alt(() => getNoResultsFoundFromBooks(isDirty, bookExists))
  );
}

// Main Component
type Props = {
  book?: WrappedRecords;
  isDirty?: boolean;
};

export default function BooksDisplay({ book, isDirty }: Props) {
  return pipe(
    O.Do,
    O.apS("isDirty", pipe(isDirty, isDirtyPredicate, O.of)),
    O.apS("bookExists", pipe(book, bookExistsPredicate, O.of)),
    O.chain(({ isDirty, bookExists }) =>
      getFinalResultDisplay(book as WrappedRecords, isDirty, bookExists)
    ),
    O.getOrElse(() => EmptyResult())
  );
}
