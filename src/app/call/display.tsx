"use client";

import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import EditSheet from "./edit-sheet";
import CreateDialog from "../phone/create-dialog";
import { Call } from "@prisma/client";
import { columns } from "./columns";

export default function Display({ calls }: { calls: Call[] }) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  return (
    <div className="w-full">
      <CreateDialog />
      {calls.length > 0 && (
        <DataTable
          columns={columns(editOpen, setEditOpen, setSelectedCall)}
          data={calls}
        />
      )}
      {selectedCall ? (
        <EditSheet
          open={editOpen}
          setOpen={setEditOpen}
          selectedCall={selectedCall}
        />
      ) : null}
    </div>
  );
}
