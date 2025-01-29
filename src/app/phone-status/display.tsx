"use client";

import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import EditSheet from "./edit-sheet";
import CreateDialog from "./create-dialog";
import { PhoneStatus } from "@prisma/client";
import { columns } from "./columns";

export default function Display({
  phoneStatus,
}: {
  phoneStatus: PhoneStatus[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPhoneStatus, setSelectedPhoneStatus] =
    useState<PhoneStatus | null>(null);

  return (
    <>
      <CreateDialog />
      {phoneStatus.length > 0 && (
        <DataTable
          columns={columns(editOpen, setEditOpen, setSelectedPhoneStatus)}
          data={phoneStatus}
        />
      )}
      {selectedPhoneStatus ? (
        <EditSheet
          open={editOpen}
          setOpen={setEditOpen}
          selectedPhoneStatus={selectedPhoneStatus}
        />
      ) : null}
    </>
  );
}
