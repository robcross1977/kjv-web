"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Phone } from "@prisma/client";
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
import { deletePhone } from "./actions";

export function columns(
  open: boolean,
  setOpen: (open: boolean) => void,
  setSelectedPhone: (phone: Phone) => void
) {
  const columns: ColumnDef<Phone>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "number",
      header: "Number",
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
        const phone = row.original;
        return (
          <ActionCell
            phone={phone}
            setSelectedPhone={setSelectedPhone}
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
  phone,
  isOpen,
  setEditOpen,
  setSelectedPhone,
}: {
  phone: Phone;
  isOpen: boolean;
  setEditOpen: (open: boolean) => void;
  setSelectedPhone: (phone: Phone) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEdit = useCallback(() => {
    setSelectedPhone(phone);
    setEditOpen(true);
  }, [phone, setSelectedPhone, setEditOpen]);

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
          onClick={() => navigator.clipboard.writeText(String(phone.id))}
        >
          Copy phone ID
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
            await deletePhone(phone.id);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
