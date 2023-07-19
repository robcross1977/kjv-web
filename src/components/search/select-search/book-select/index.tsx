import { Dispatch, SetStateAction } from "react";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";
import { filterBookOptions } from "./book-filter";
import ComboBox from "@components/shared/combobox";
import { KeyValueItem } from "@/components/shared/types";

type Props = {
  selectedBook: KeyValueItem;
  setSelectedBook: (kvItem: KeyValueItem) => void;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

/**
 * A React Book ComboBox component used to select biblical books.
 *
 * @param param0 The props for the BookSelect component.
 * @returns A component that allows the user to select a biblical book.
 *
 */
export default function BookSelect({
  selectedBook,
  setSelectedBook,
  query,
  setQuery,
}: Props) {
  return (
    <div className="flex flex-col">
      <div className="text-sm text-gray-300">Book</div>
      <div className="w-full">
        <ComboBox
          selectedValue={selectedBook}
          onChange={setSelectedBook}
          query={query}
          setQuery={setQuery}
          items={filterBookOptions(query).map((b) => {
            return {
              key: b.key,
              value: capitalizeFirstAlphabeticCharacter(b.value),
            };
          })}
          inputMode="search"
        />
      </div>
    </div>
  );
}
