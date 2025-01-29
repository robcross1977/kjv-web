"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { User } from "@prisma/client";
import { useState } from "react";
import EditSheet from "./edit-sheet";

export default function Display({ users }: { users: User[] }) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="w-full">
      {users.length > 0 && (
        <DataTable
          columns={columns(editOpen, setEditOpen, setSelectedUser)}
          data={users}
        />
      )}
      {selectedUser ? (
        <EditSheet open={editOpen} setOpen={setEditOpen} user={selectedUser} />
      ) : null}
    </div>
  );
}
