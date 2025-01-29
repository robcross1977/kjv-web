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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminForm from "./admin-form";
import { createAdmin } from "./actions";
import { Admin } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSchema } from "../types/db";
import { useForm } from "react-hook-form";

export default function CreateAdminDialog({ ...props }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<Admin>({
    resolver: zodResolver(AdminSchema),
    defaultValues: {
      id: -1,
      email: "",
      name: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  const onSubmit = async (admin: Admin) => {
    try {
      await createAdmin(admin);

      toast({
        title: "Success",
        description: "Admin added successfully.",
      });

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
