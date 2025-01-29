"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PhoneStatus } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState, useCallback } from "react";
import { deletePhoneStatus } from "./actions";

export function columns(
  open: boolean,
  setOpen: (open: boolean) => void,
  setSelectedPhoneStatus: (phoneStatus: PhoneStatus) => void
) {
  const columns: ColumnDef<PhoneStatus>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const phoneStatus = row.original;
        return (
          <ActionCell
            phoneStatus={phoneStatus}
            setSelectedPhoneStatus={setSelectedPhoneStatus}
            setEditOpen={setOpen}
            isOpen={open}
          />
        );
      },
    },
  ];

  return columns;
}

const ActionCell = ({
  phoneStatus,
  isOpen,
  setEditOpen,
  setSelectedPhoneStatus,
}: {
  phoneStatus: PhoneStatus;
  isOpen: boolean;
  setEditOpen: (open: boolean) => void;
  setSelectedPhoneStatus: (phoneStatus: PhoneStatus) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEdit = useCallback(() => {
    setSelectedPhoneStatus(phoneStatus);
    setEditOpen(true);
  }, [phoneStatus, setSelectedPhoneStatus, setEditOpen]);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger disabled={isOpen}>
        {isDropdownOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(String(phoneStatus.id))}
        >
          Copy phone status ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            handleEdit();
            setIsDropdownOpen(false);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await deletePhoneStatus(phoneStatus.id);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
