import { Dispatch, SetStateAction } from "react";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";
import { filterBookOptions } from "./book-filter";
import ComboBox, { KeyValueItem } from "@components/shared/combobox";

type Props = {
  selectedBook: KeyValueItem;
  setSelectedBook: Dispatch<SetStateAction<KeyValueItem>>;
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
    <div>
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
  );
}
