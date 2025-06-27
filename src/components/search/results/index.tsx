"use client";

import ChaptersDisplay from "./chapter";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";
import { ChapterRecords, ValidBookName, WrappedRecords } from "kingjames";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import PrevButton from "./prev-button";
import NextButton from "./next-button";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const isDirtyPredicate = (isDirty: boolean | undefined = false) =>
  isDirty === true;

const bookExistsPredicate = (b: WrappedRecords | undefined) =>
  b !== undefined && Object.keys(b.records).length > 0;

// Helper Components
type ResultDisplayProps = {
  results: WrappedRecords;
};
function ResultDisplay({ results }: ResultDisplayProps) {
  return (
    <div className="w-full animate-fade-up">
      {displayTopLevelBookRecords(results)}
    </div>
  );
}

function NoResultsFoundResult() {
  return (
    <div className="text-center py-16 animate-fade-up">
      <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl p-8 border-2 border-dashed border-muted-foreground/30">
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
          No Results Found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or browse by book and chapter.
        </p>
      </div>
    </div>
  );
}

function EmptyResult() {
  return <></>;
}

type BookContainerProps = {
  title: ValidBookName;
  chapters: ChapterRecords;
};
function BookContainer({ title, chapters }: BookContainerProps) {
  const searchParams = useSearchParams();
  const verse = pipe(searchParams.get("verse"), O.fromNullable);

  return (
    <div
      key={title}
      className="flex flex-col w-full h-full bg-gradient-to-br from-card to-card/95 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-up"
    >
      <TitleDisplay title={title} />
      <div className="flex-1 mt-6">
        <ChaptersDisplay book={title} chapters={chapters} />
      </div>

      {O.isNone(verse) ? (
        <>
          <Separator className="my-6 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="w-full flex justify-between items-center bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20 rounded-xl p-4">
            <PrevButton />
            <NextButton />
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}

type TitleProps = {
  title: string;
};
function TitleDisplay({ title }: TitleProps) {
  return (
    <div className="w-full flex justify-between items-center bg-gradient-to-r from-header/20 via-header/30 to-header/20 rounded-xl p-4 shadow-sm">
      <div className="flex-shrink-0">
        <PrevButton />
      </div>

      <div className="flex-1 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary via-red-600 to-primary bg-clip-text text-transparent hover:from-red-700 hover:via-primary hover:to-red-700 transition-all duration-500 leading-tight py-2">
          {capitalizeFirstAlphabeticCharacter(title)}
        </h1>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mt-2 transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></div>
      </div>

      <div className="flex-shrink-0">
        <NextButton />
      </div>
    </div>
  );
}

// Controller Logic
function displayTopLevelBookRecords(results: WrappedRecords) {
  return pipe(
    results.records,
    R.mapWithIndex((title, chapters) => (
      <BookContainer
        key={title}
        title={title as ValidBookName}
        chapters={chapters}
      />
    )),
    R.toArray,
    A.map(([book, element]) => element)
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
