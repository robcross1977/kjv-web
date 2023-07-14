import { ValidBookName, chapterCountFrom } from "kingjames";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import { KeyValueItem } from "@/components/shared/combobox";

// The chapterFilterPredicate function takes a book option and a query and returns a boolean indicating whether the
// chapter option starts the query.
function chapterFilterPredicate(chapter: string, query: string) {
  return chapter.startsWith(query);
}

// The filterChaptersByQuery function takes an array of chapters and a query and returns the list of chapters that match
// the query.
function filterChaptersByQuery(chapterOptions: KeyValueItem[], query: string) {
  return pipe(
    chapterOptions,
    A.filter((chapter) => chapterFilterPredicate(chapter.value, query))
  );
}

/**
 * The filterChapterOptions takes a book and a query and returns the list of chapter options based on that book and
 * query combination. If no query is provided, it returns the full list of chapter options.
 *
 * @param book The book to filter the chapter options by.
 * @param query The query to filter the chapter options by.
 * @returns The list of chapter options based on the book and query.
 */
function filterChapterOptions(book: ValidBookName, query: string) {
  const chapterOptions = A.makeBy(chapterCountFrom(book), (i) => {
    return {
      key: i + 1,
      value: String(i + 1),
    };
  });
  return query === ""
    ? chapterOptions
    : filterChaptersByQuery(chapterOptions, query);
}

export { filterChapterOptions };
