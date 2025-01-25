"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Message } from "ai/react";

export const columns: ColumnDef<Message>[] = [
  {
    header: "role",
    accessorKey: "role",
  },
  {
    header: "content",
    accessorKey: "content",
  },
];
