"use client";

import { FlattenedReference } from "@/types/bible";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<FlattenedReference>[] = [
  {
    header: "Book",
    accessorKey: "book",
  },
  {
    header: "Chapter",
    accessorKey: "chapter",
  },
  {
    header: "Verse",
    accessorKey: "verse",
  },
  {
    header: "Text",
    accessorKey: "text",
  },
];
