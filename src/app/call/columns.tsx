"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { deleteCall } from "./actions";
import { CallWithPhone } from "./types";

export function columns(
  open: boolean,
  setOpen: (open: boolean) => void,
  setSelectedCall: (call: CallWithPhone) => void
) {
  const columns: ColumnDef<CallWithPhone>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.original.phone;
        return `${phone.name}:${phone.phone}`;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "script",
      header: "Script",
    },
    {
      accessorKey: "notes",
      header: "Notes",
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
        const call = row.original;
        return (
          <ActionCell
            call={call}
            setSelectedCall={setSelectedCall}
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
  call,
  isOpen,
  setEditOpen,
  setSelectedCall,
}: {
  call: CallWithPhone;
  isOpen: boolean;
  setEditOpen: (open: boolean) => void;
  setSelectedCall: (call: CallWithPhone) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEdit = useCallback(() => {
    setSelectedCall(call);
    setEditOpen(true);
  }, [call, setSelectedCall, setEditOpen]);

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
          onClick={() => navigator.clipboard.writeText(String(call.id))}
        >
          Copy call ID
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
            await deleteCall(call.id);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
