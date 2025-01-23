"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Dispatch, SetStateAction, useState } from "react";
import { bookNames, ValidBookName } from "kingjames";
import { KeyValueItem } from "@/components/shared/types";
import { getBookOptionFromBook } from "./book-filter";
import { capitalizeFirstAlphabeticCharacter } from "@/util/string-util";

type Props = {
  setSelected: Dispatch<SetStateAction<KeyValueItem>>;
  selected: KeyValueItem | null;
};
export function BookCombobox({ setSelected, selected }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selected ? selected.value : "Select book..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput />
          <CommandList>
            <CommandEmpty>No book found.</CommandEmpty>
            <CommandGroup>
              {bookNames.map((b) => (
                <CommandItem
                  key={b}
                  value={b}
                  onSelect={(value) => {
                    const book = getBookOptionFromBook(value as ValidBookName);

                    setSelected(book ?? null);

                    setOpen(false);
                  }}
                >
                  {capitalizeFirstAlphabeticCharacter(b)}
                  <Check
                    className={cn(
                      "ml-auto",
                      selected && selected.value === b
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
