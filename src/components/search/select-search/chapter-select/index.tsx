import { Dispatch, SetStateAction } from "react";
import { filterChapterOptions } from "./chapter-filter";
import ComboBox, { KeyValueItem } from "@components/shared/combobox";
import { ValidBookName } from "kingjames";

type Props = {
  selectedBook: ValidBookName;
  selectedChapter: KeyValueItem;
  setSelectedChapter: Dispatch<SetStateAction<KeyValueItem>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

/**
 * A React Chapter ComboBox component used to select biblical chapters.
 *
 * @param param0 The props for the ChapterSelect component.
 * @returns A component that allows the user to select a biblical chapter.
 *
 */
export default function ChapterSelect({
  selectedBook,
  selectedChapter,
  setSelectedChapter,
  query,
  setQuery,
}: Props) {
  return (
    <div>
      <ComboBox
        selectedValue={selectedChapter}
        onChange={setSelectedChapter}
        query={query}
        setQuery={setQuery}
        items={filterChapterOptions(
          selectedBook.toLowerCase() as ValidBookName,
          query
        ).map((b) => b)}
        inputMode="numeric"
      />
    </div>
  );
}
