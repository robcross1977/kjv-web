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
import { updatePhoneStatus } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { PhoneStatus } from "@prisma/client";
import { PhoneStatusSchema } from "../types/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export default function EditSheet({
  open,
  setOpen,
  selectedPhoneStatus,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedPhoneStatus: PhoneStatus;
}) {
  const { toast } = useToast();
  const form = useForm<PhoneStatus>({
    resolver: zodResolver(PhoneStatusSchema),
    defaultValues: {
      id: selectedPhoneStatus.id ?? -1,
      status: selectedPhoneStatus.status ?? "",
      createdAt: selectedPhoneStatus.createdAt ?? new Date(),
      updatedAt: selectedPhoneStatus.updatedAt ?? new Date(),
    },
    values: {
      id: selectedPhoneStatus.id ?? -1,
      status: selectedPhoneStatus.status ?? "",
      createdAt: selectedPhoneStatus.createdAt ?? new Date(),
      updatedAt: selectedPhoneStatus.updatedAt ?? new Date(),
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  console.dir(form.getValues());
  const onSubmit = async (phoneStatus: PhoneStatus) => {
    try {
      await updatePhoneStatus(phoneStatus);

      toast({
        title: "Success",
        description: "Phone status updated successfully.",
      });

      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      toast({
        title: "Error",
        description:
          (error as any)?.response?.data?.message ||
          "Failed to update phone status.",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Phone Status</SheetTitle>
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Status" />
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
