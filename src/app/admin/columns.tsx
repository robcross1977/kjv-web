"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Admin } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { deleteAdmin } from "./actions";

export function columns(
  open: boolean,
  setOpen: (open: boolean) => void,
  setSelectedAdmin: (admin: Admin) => void,
  refreshData: () => void
) {
  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const admin = row.original;
        return (
          <ActionCell
            admin={admin}
            open={open}
            setSelectedAdmin={setSelectedAdmin}
            setEditOpen={setOpen}
            refreshData={refreshData}
          />
        );
      },
    },
  ];

  return columns;
}

const ActionCell = ({
  admin,
  open,
  setEditOpen,
  setSelectedAdmin,
  refreshData,
}: {
  admin: Admin;
  open: boolean;
  setEditOpen: (open: boolean) => void;
  setSelectedAdmin: (admin: Admin) => void;
  refreshData: () => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger disabled={open}>
        {isDropdownOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(String(admin.id))}
        >
          Copy admin ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedAdmin(admin);
            setEditOpen(true);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await deleteAdmin(admin.id);
            refreshData();
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
