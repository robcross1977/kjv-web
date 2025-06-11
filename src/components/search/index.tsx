"use client";

import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { useTools } from "@/components/tools/tools-provider";
import BooksDisplay from "./results";
import { ValidBookName, WrappedRecords } from "kingjames";

type Props = {
  book?: ValidBookName;
  chapter?: number;
  verse?: number;
  results?: WrappedRecords;
};

export default function Search({ book, chapter, verse, results }: Props) {
  const { openToolsSheet } = useTools();

  return (
    <div className="flex flex-col w-full mx-auto h-screen">
      <div className="flex flex-grow w-full pt-2">
        <div className="w-11/12 lg:w-2/3 mx-auto">
          <div className="self-end">
            <Button
              variant="outline"
              onClick={() => openToolsSheet("search")}
              className="flex items-center gap-2"
            >
              <Wrench className="h-4 w-4" />
              Tools
            </Button>
          </div>
          <BooksDisplay results={results} />
        </div>
      </div>
    </div>
  );
}
