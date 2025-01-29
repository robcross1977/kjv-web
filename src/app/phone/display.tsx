"use client";

import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import EditSheet from "./edit-sheet";
import CreateDialog from "./create-dialog";
import { Phone } from "@prisma/client";
import { columns } from "./columns";

export default function Display({ phone }: { phone: Phone[] }) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);

  return (
    <>
      <CreateDialog />
      {phone.length > 0 && (
        <DataTable
          columns={columns(editOpen, setEditOpen, setSelectedPhone)}
          data={phone}
        />
      )}
      {selectedPhone ? (
        <EditSheet
          open={editOpen}
          setOpen={setEditOpen}
          selectedPhone={selectedPhone}
        />
      ) : null}
    </>
  );
}
