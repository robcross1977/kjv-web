"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Admin } from "./types";
import AdminForm from "./admin-form";
import { createAdmin } from "./actions";

export default function AddAdminDialog({
  form,
  ...props
}: {
  form: UseFormReturn<
    {
      id: number;
      name: string;
      email: string;
    },
    any,
    undefined
  >;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const onSubmit = async (admin: Admin) => {
    try {
      await createAdmin(admin);

      toast({
        title: "Success",
        description: "Admin added successfully.",
      });

      form.reset();

      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      toast({
        title: "Error",
        description:
          (error as any)?.response?.data?.message || "Failed to add Admin.",
      });
    }
  };

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Admin</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <AdminForm
          form={form}
          onSubmit={onSubmit}
          type="insert"
          hideUid={true}
        />
      </DialogContent>
    </Dialog>
  );
}
