"use client";

import Search from "@/components/search";
import Header from "@components/shared/header";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import {
  ValidBookName,
  WrappedRecords,
  chapterCountFrom,
  search,
  verseCountFrom,
} from "kingjames";

type Props = {
  searchParams?: {
    query?: string;
    book?: ValidBookName;
    chapter?: number;
    verse?: number;
  };
};

function getQuery(query?: string) {
  return pipe(
    query,
    O.fromNullable,
    O.alt(() => O.some(""))
  );
}

function getFinalQueryFromString(
  book?: ValidBookName,
  chapter?: number,
  verse?: number,
  query?: string
) {
  return pipe(
    book,
    isBasic,
    O.fromPredicate((isBasic) => isBasic),
    O.map(() => getBasicQuery(book, chapter, verse)),
    O.alt(() => getQuery(query))
  );
}

function getSearchResults(query: string) {
  return pipe(
    query,
    O.fromPredicate((query) => query.length > 0),
    O.map<string, WrappedRecords>(search),
    O.alt<WrappedRecords>(() => O.some({ type: "none", records: {} }))
  );
}

export default function Home({ searchParams }: Props) {
  const { query, book, chapter, verse } = searchParams ?? {};

  return pipe(
    O.Do,
    O.apS("finalQuery", getFinalQueryFromString(book, chapter, verse, query)),
    O.bind("results", ({ finalQuery }) => getSearchResults(finalQuery)),
    O.chain(({ results }) => {
      return pipe(
        <div>
          <Header />
          <main className="w-full flex flex-col mx-auto">
            <Search
              book={book}
              chapter={chapter}
              verse={verse}
              results={results}
            />
          </main>
        </div>,
        O.some
      );
    }),
    O.getOrElse(() => <></>)
  );
}

function isBasic(book?: string) {
  return book !== undefined && book.length > 0;
}

function getBasicBook(book?: ValidBookName) {
  return O.fromNullable(book);
}

function getBasicChapter(book: ValidBookName, chapter?: number) {
  return pipe(
    chapter,
    O.fromNullable,
    O.chain(O.fromPredicate((c) => c >= 1 && c <= chapterCountFrom(book))),
    O.map(Number)
  );
}

function verseInBookChapter(
  book: ValidBookName,
  chapter: number,
  verse: number
) {
  return pipe(
    O.Do,
    O.apS("maxVerseCount", verseCountFrom(book, chapter)),
    O.map(({ maxVerseCount }) => verse >= 1 && verse <= maxVerseCount),
    O.getOrElse(() => false)
  );
}

function getBasicVerse(book: ValidBookName, chapter: number, verse?: number) {
  return pipe(
    verse,
    O.fromNullable,
    O.chain(O.fromPredicate((v) => verseInBookChapter(book, chapter, v))),
    O.map((v) => `:${v}`),
    O.alt(() => O.some(""))
  );
}

function getBasicQuery(book?: ValidBookName, chapter?: number, verse?: number) {
  return pipe(
    O.Do,
    O.apS("book", getBasicBook(book)),
    O.bind("chapter", ({ book }) => getBasicChapter(book, chapter)),
    O.bind("verse", ({ book, chapter }) => getBasicVerse(book, chapter, verse)),
    O.map(({ book, chapter, verse }) => `${book} ${chapter}${verse}`),
    O.getOrElse(() => "")
  );
}
