import { Dispatch, SetStateAction } from "react";
import { filterChapterOptions } from "./chapter-filter";
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
} from "@components/ui/select";

type Props = {
  selectedBook: ValidBookName;
  selectedChapter: KeyValueItem | null;
  setSelectedChapter: Dispatch<SetStateAction<KeyValueItem | null>>;
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
}: Props) {
  return (
    <section className="flex flex-col">
      <div className="text-sm">Chapter</div>

      <Select
        onValueChange={(value) => {
          const selected = filterChapterOptions(selectedBook, "").find(
            (c) => c.value === value
          );
          setSelectedChapter(selected ?? null);
        }}
        defaultValue={selectedChapter?.value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a chapter"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Chapter</SelectLabel>
            {filterChapterOptions(selectedBook, "").map((chapter) => {
              return (
                <SelectItem
                  key={chapter.key}
                  value={chapter.value}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  {chapter.value}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
}
