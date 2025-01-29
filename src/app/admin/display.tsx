"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Admin, adminSchema } from "./types";
import { useState } from "react";
import EditSheet from "./edit-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreateDialog from "./create-dialog";

export default function Display({
  admins,
  refreshData,
  version,
}: {
  admins: Admin[];
  refreshData: () => void;
  version: string;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const form = useForm<Admin>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      id: -1,
      email: "",
      name: "",
    },
  });

  const handleRefresh = async () => {
    await refreshData();
    window.location.search = `?version=${Number(version) + 1}`;
  };

  return (
    <>
      <CreateDialog form={form} />
      {admins.length > 0 && (
        <DataTable
          columns={columns(
            editOpen,
            setEditOpen,
            setSelectedAdmin,
            refreshData
          )}
          data={admins}
        />
      )}
      {selectedAdmin ? (
        <EditSheet
          open={editOpen}
          setOpen={setEditOpen}
          form={form}
          admin={selectedAdmin}
        />
      ) : null}
    </>
  );
}
