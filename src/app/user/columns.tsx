"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@prisma/client";
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
import { deleteUser } from "./actions";

export function columns(
  open: boolean,
  setOpen: (open: boolean) => void,
  setSelectedUser: (user: User) => void
) {
  const columns: ColumnDef<User>[] = [
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
      accessorKey: "phone",
      header: "Phone",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <ActionCell
            user={user}
            open={open}
            setSelectedUser={setSelectedUser}
            setEditOpen={setOpen}
          />
        );
      },
    },
  ];

  return columns;
}

const ActionCell = ({
  user,
  open,
  setEditOpen,
  setSelectedUser,
}: {
  user: User;
  open: boolean;
  setEditOpen: (open: boolean) => void;
  setSelectedUser: (user: User) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex justify-end">
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
            onClick={() => navigator.clipboard.writeText(String(user.uid))}
          >
            Copy user UID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setSelectedUser(user);
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await deleteUser(String(user.uid));
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
