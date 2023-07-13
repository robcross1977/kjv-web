import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { ValidBookName, orderedBookNames } from "kingjames";
import * as O from "fp-ts/Option";
import * as ROA from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";
import { BookOption } from "./types";

type BookOptionTuple = readonly [number, ValidBookName];

function getBookOptions() {
  return pipe(
    O.Do,
    O.apS("keys", O.some(ROA.makeBy(66, (i) => i + 1))),
    O.bind("values", () => O.some(orderedBookNames)),
    O.bind("optionTuples", ({ keys, values }) => O.some(ROA.zip(keys, values))),
    O.map(({ optionTuples }) =>
      pipe(
        optionTuples,
        ROA.map<BookOptionTuple, BookOption>(([key, value]) => {
          return { key, value };
        })
      )
    ),
    O.getOrElse<readonly BookOption[]>(() => [])
  );
}

type Props = {
  selectedBook: BookOption;
  setSelectedBook: Dispatch<SetStateAction<BookOption>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

export default function ChapterSelect({
  selectedBook,
  setSelectedBook,
  query,
  setQuery,
}: Props) {
  const books = getBookOptions();
  const filteredBooks =
    query === ""
      ? books
      : books.filter((book) =>
          book.value
            .toLowerCase()
            .replace(/\s+/g, "")
            .startsWith(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div>
      <Combobox value={selectedBook} onChange={setSelectedBook}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-slate-900 focus:ring-0"
              displayValue={(book: BookOption) =>
                capitalizeFirstAlphabeticCharacter(book.value)
              }
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredBooks.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredBooks.map((book) => (
                  <Combobox.Option
                    key={book.key}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={book}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {capitalizeFirstAlphabeticCharacter(book.value)}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
