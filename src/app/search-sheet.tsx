"use client";

import FreeSearch from "@/components/search/free-search/free-search";
import SelectSearch from "@/components/search/select-search";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ValidBookName } from "kingjames";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
};
export function SearchSheet({ book, chapter, verse }: Props) {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">Search</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-3xl pb-2">Search</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col w-full space-y-5">
          <Separator />
          <FreeSearch />
          <Separator />
          <SelectSearch book={book} chapter={chapter} verse={verse} />
          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  );
}
