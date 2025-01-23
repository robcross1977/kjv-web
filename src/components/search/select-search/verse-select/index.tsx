import { Dispatch, SetStateAction } from "react";
import { filterVerseOptions } from "./verse-filter";
import { ValidBookName } from "kingjames";
import { KeyValueItem } from "@/components/shared/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  selectedBook: ValidBookName;
  selectedChapter: number;
  selectedVerse: KeyValueItem | null;
  setSelectedVerse: Dispatch<SetStateAction<KeyValueItem | null>>;
};

/**
 * A React Chapter ComboBox component used to select biblical chapters.
 *
 * @param param0 The props for the ChapterSelect component.
 * @returns A component that allows the user to select a biblical chapter.
 *
 */
export default function VerseSelect({
  selectedBook,
  selectedChapter,
  selectedVerse,
  setSelectedVerse,
}: Props) {
  return (
    <div className="flex flex-col">
      <div className="text-sm">Verse</div>
      <Select
        onValueChange={(value) => {
          const selected = filterVerseOptions(
            selectedBook,
            selectedChapter,
            ""
          ).find((v) => v.value === value);
          setSelectedVerse(selected ?? null);
        }}
        defaultValue={selectedVerse?.value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a verse"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Verse</SelectLabel>
            {filterVerseOptions(selectedBook, selectedChapter, "").map(
              (verse) => {
                return (
                  <SelectItem
                    key={verse.key}
                    value={verse.value}
                    onClick={() => setSelectedVerse(verse)}
                  >
                    {verse.value}
                  </SelectItem>
                );
              }
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
