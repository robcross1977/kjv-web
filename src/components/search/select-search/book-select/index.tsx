import { Dispatch, SetStateAction } from "react";
import { BookCombobox } from "./book-combobox";
import { KeyValueItem } from "@/components/shared/types";

type Props = {
  selectedBook: KeyValueItem | null;
  setSelectedBook: Dispatch<SetStateAction<KeyValueItem>>;
};

/**
 * A React Book ComboBox component used to select biblical books.
 *
 * @param param0 The props for the BookSelect component.
 * @returns A component that allows the user to select a biblical book.
 *
 */
export default function BookSelect({ selectedBook, setSelectedBook }: Props) {
  return (
    <div className="flex flex-col">
      <div className="text-sm">Book</div>
      <BookCombobox selected={selectedBook} setSelected={setSelectedBook} />
    </div>
  );
}
