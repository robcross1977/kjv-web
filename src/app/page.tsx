import Search from "@/components/search";
import Header from "@components/shared/header";
import LastReferenceNavigator from "@/components/last-reference-navigator";
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
  searchParams?: Promise<{
    query?: string;
    book?: ValidBookName;
    chapter?: number;
    verse?: number;
  }>;
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

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const { query, book, chapter, verse } = searchParams ?? {};

  // Check if user has any current search parameters
  const hasCurrentSearch = !!(query || book || chapter || verse);
  // Force cache bust

  return pipe(
    O.Do,
    O.apS("finalQuery", getFinalQueryFromString(book, chapter, verse, query)),
    O.bind("results", ({ finalQuery }) => getSearchResults(finalQuery)),
    O.chain(({ results }) => {
      return pipe(
        <div>
          <Header />
          <LastReferenceNavigator hasCurrentSearch={hasCurrentSearch} />
          <main className="w-full flex flex-col mx-auto">
            <Search
              book={book}
              chapter={chapter}
              verse={verse}
              query={query}
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
  if (!chapter) return O.none;
  const totalChapters = chapterCountFrom(book.toLowerCase() as ValidBookName);
  if (chapter < 1 || chapter > totalChapters) return O.none;
  return O.some(chapter);
}

function verseInBookChapter(
  book: ValidBookName,
  chapter: number,
  verse: number
) {
  const verseCountOption = verseCountFrom(
    book.toLowerCase() as ValidBookName,
    chapter
  );
  if (O.isNone(verseCountOption)) return false;
  const maxVerses = verseCountOption.value;
  return verse >= 1 && verse <= maxVerses;
}

function getBasicVerse(book: ValidBookName, chapter: number, verse?: number) {
  if (!verse) return O.some("");
  if (verseInBookChapter(book, chapter, verse)) {
    return O.some(`:${verse}`);
  }
  return O.some("");
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
