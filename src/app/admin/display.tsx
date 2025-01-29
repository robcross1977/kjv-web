"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Admin } from "@prisma/client";
import { useState } from "react";
import EditSheet from "./edit-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreateDialog from "./create-dialog";
import { AdminSchema } from "../types/db";

export default function Display({ admins }: { admins: Admin[] }) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const form = useForm<Admin>({
    resolver: zodResolver(AdminSchema),
    defaultValues: {
      id: -1,
      email: "",
      name: "",
    },
  });

  return (
    <>
      <CreateDialog form={form} />
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
          form={form}
          admin={selectedAdmin}
        />
      ) : null}
    </>
  );
}
