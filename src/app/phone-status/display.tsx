"use client";

import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import EditSheet from "./edit-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreateDialog from "./create-dialog";
import { PhoneStatus } from "@prisma/client";
import { PhoneStatusSchema } from "../types/db";
import { columns } from "./columns";

export default function Display({
  phoneStatus,
}: {
  phoneStatus: PhoneStatus[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPhoneStatus, setSelectedPhoneStatus] =
    useState<PhoneStatus | null>(null);
  const form = useForm<PhoneStatus>({
    resolver: zodResolver(PhoneStatusSchema),
    defaultValues: {
      id: -1,
      status: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return (
    <>
      <CreateDialog form={form} />
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
          form={form}
          phoneStatus={selectedPhoneStatus}
        />
      ) : null}
    </>
  );
}
