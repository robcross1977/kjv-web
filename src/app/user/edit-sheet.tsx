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
import { updateUser } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { User } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "../types/db";
import { useEffect } from "react";

export default function EditSheet({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
}) {
  const { toast } = useToast();
  const form = useForm<User>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      uid: -1,
      email: "",
      name: "",
      phone: "",
    },
    values: {
      uid: user.uid ?? -1,
      email: user.email ?? "",
      name: user.name ?? "",
      phone: user.phone ?? "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  const onSubmit = async (user: User) => {
    try {
      await updateUser(user);

      toast({
        title: "Success",
        description: "User updated successfully.",
      });

      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      toast({
        title: "Error",
        description:
          (error as any)?.response?.data?.message || "Failed to update User.",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="uid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      placeholder="UID"
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
            <FormField
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Phone" />
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
