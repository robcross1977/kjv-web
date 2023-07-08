"use client";

import Search from "@/components/search";
import Header from "@/components/shared/header";
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

export default function Home({ searchParams }: Props) {
  const { query, book, chapter, verse } = searchParams ?? {};
  const isBasicQuery = isBasic(book);
  const finalQuery = isBasicQuery
    ? getBasicQuery(book, chapter, verse)
    : query ?? "";

  const results: WrappedRecords =
    finalQuery.length > 0 ? search(finalQuery) : { type: "none", records: {} };

  return (
    <div className="flex flex-col w-11/12 mx-auto my-5">
      <Header />
      <Search
        query={isBasicQuery ? undefined : query ?? ""}
        book={book}
        chapter={chapter}
        verse={verse}
        results={results}
      />
    </div>
  );
}

function isBasic(book?: string) {
  return book !== undefined && book.length > 0;
}

function getBasicQuery(book?: ValidBookName, chapter?: number, verse?: number) {
  return pipe(
    O.Do,
    O.apS("book", O.fromNullable(book)),
    O.bind("chapter", ({ book }) =>
      pipe(
        chapter,
        O.fromNullable,
        O.chain(O.fromPredicate((c) => c >= 1 && c <= chapterCountFrom(book))),
        O.map(String)
      )
    ),
    O.bind("verse", ({ book, chapter }) =>
      pipe(
        verse,
        O.fromNullable,
        O.chain(
          O.fromPredicate((v) =>
            pipe(
              O.Do,
              O.apS("maxVerseCount", verseCountFrom(book, Number(chapter))),
              O.map(({ maxVerseCount }) => v >= 1 && v <= maxVerseCount),
              O.getOrElse(() => false)
            )
          )
        ),
        O.map((v) => `:${v}`),
        O.alt(() => O.some(""))
      )
    ),
    O.map(({ book, chapter, verse }) => `${book} ${chapter}${verse}`),
    O.getOrElse(() => "")
  );
}
