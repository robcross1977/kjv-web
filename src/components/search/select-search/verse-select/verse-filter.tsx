import { ValidBookName, verseCountFrom } from "kingjames";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { KeyValueItem } from "@/components/shared/combobox";

// The verseFilterPredicate function takes a verse option and a query and returns a boolean indicating whether the verse
// option starts the query.
function verseFilterPredicate(verse: string, query: string) {
  return verse.startsWith(query);
}

// The filterVersesByQuery function takes an array of verses and a query and returns the list of verses that match
// the query.
function filterVersesByQuery(verseOptions: KeyValueItem[], query: string) {
  return pipe(
    verseOptions,
    A.filter((verse) => verseFilterPredicate(verse.value, query))
  );
}

/**
 * The filterVerseOptions takes a book, chapter and a query and returns the list of verse options based on that book,
 * chapter and query combination. If no query is provided, it returns the full list of verse options.
 *
 * @param book The book to filter the verse options by.
 * @param chapter The chapter to filter the verse options by.
 * @param query The query to filter the chapter options by.
 * @returns The list of verse options based on the book, chapter and query.
 */
function filterVerseOptions(
  book: ValidBookName,
  chapter: number,
  query: string
) {
  // Get the verse count opttion using the book and chapter
  const verseCount = verseCountFrom(book, chapter);

  const verseOptions = pipe(
    // No matter what the "All" option will exist so start with it
    [{ key: 0, value: "All" }],

    // Join it together with the filtered verse options
    A.concat(
      // If there is a verse count, make the verse options
      O.isSome(verseCount)
        ? A.makeBy(verseCount.value, (i) => {
            return {
              key: i + 1,
              value: String(i + 1),
            };
          })
        : [] // If there is not a verse count return an empty array
    )
  );

  return query === "" ? verseOptions : filterVersesByQuery(verseOptions, query);
}

export { filterVerseOptions };
