"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Admin } from "@prisma/client";
import { useState } from "react";
import EditSheet from "./edit-sheet";
import CreateAdminDialog from "./create-dialog";

export default function Display({ admins }: { admins: Admin[] }) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  return (
    <>
      <CreateAdminDialog />
      {admins.length > 0 && (
        <DataTable
          columns={columns(editOpen, setEditOpen, setSelectedAdmin)}
          data={admins}
        />
      )}
      {selectedAdmin ? (
        <EditSheet
          open={editOpen}
          setOpen={setEditOpen}
          admin={selectedAdmin}
        />
      ) : null}
    </>
  );
}
