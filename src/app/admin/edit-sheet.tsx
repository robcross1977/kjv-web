"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { updateAdmin } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Admin } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSchema } from "../types/db";
import { useEffect } from "react";

export default function EditSheet({
  open,
  setOpen,
  admin,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  admin: Admin;
}) {
  const { toast } = useToast();
  const form = useForm<Admin>({
    resolver: zodResolver(AdminSchema),
    defaultValues: {
      id: NaN,
      email: "",
      name: "",
    },
    values: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  const onSubmit = async (admin: Admin) => {
    try {
      await updateAdmin(admin);

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Admin</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      placeholder="Id"
                      className="bg-muted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
