import { BookOption, bookOptions } from "../types";
import { ValidBookName } from "kingjames";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";

/**
 * The getBookOptionFromBook function takes a ValidBookName and returns a BookOption type.
 *
 * @param book The book name to get the BookOption type from.
 * @returns The book option type or the "Genesis" book option if something goes wrong
 */
function getBookOptionFromBook(book: ValidBookName) {
  return pipe(
    // Take the collection of book options
    bookOptions,

    // Find the first book option that matches the book name
    A.findFirst((b) => b.value === book),

    // If the book option is found, return it, otherwise return the first book option (Genesis)
    O.getOrElse<BookOption>(() => {
      return {
        key: bookOptions[0].key,
        value: capitalizeFirstAlphabeticCharacter(
          bookOptions[0].value
        ) as ValidBookName,
      };
    })
  );
}

// The getFormattedQuery function takes the query and formats it how the filter predicate expects it.
function getFormattedQuery(query: string) {
  return query.toLowerCase().replace(/\s+/g, "");
}

// The bookFilterPredicate function takes a book option and a query and returns a boolean indicating whether the book
// option starts the query.
function bookFilterPredicate(book: BookOption, query: string) {
  return book.value
    .toLowerCase()
    .replace(/\s+/g, "")
    .startsWith(getFormattedQuery(query));
}

// The filterBooksByQuery function takes a query and returns the list of books that match the query.
function filterBooksByQuery(query: string) {
  return pipe(
    bookOptions,
    A.filter((book) => bookFilterPredicate(book, query))
  );
}

/**
 * The filterBookOptions takes a query and returns the list of book options based on that query. If no query is
 * provided, it returns the full list of book options.
 *
 * @param query The query to filter the book options by.
 * @returns The list of book options based on the query.
 */
function filterBookOptions(query: string) {
  return query === "" ? bookOptions : filterBooksByQuery(query);
}

export { filterBookOptions, getBookOptionFromBook };
