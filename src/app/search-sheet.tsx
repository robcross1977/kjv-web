"use client";

import FreeSearch from "@/components/search/free-search/free-search";
import SelectSearch from "@/components/search/select-search";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ValidBookName } from "kingjames";
import { useState } from "react";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
  open?: boolean;
};
export function SearchSheet({ book, chapter, verse }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(!open)}>
          Search
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-3xl pb-2">Search</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col w-full space-y-5">
          <Separator />
          <FreeSearch setOpen={setOpen} />
          <Separator />
          <SelectSearch
            book={book}
            chapter={chapter}
            verse={verse}
            setOpen={setOpen}
          />
          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  );
}
