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
import { updatePhone } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Phone, PhoneStatus } from "@prisma/client";
import { PhoneSchema } from "../types/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import PhoneInput from "./phone-input";
import { z } from "zod";
import PhoneStatusFormItem from "./phone-status-form-item";

export default function EditSheet({
  open,
  setOpen,
  selectedPhone,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedPhone: Phone;
}) {
  const { toast } = useToast();
  const form = useForm<Phone>({
    resolver: zodResolver(
      PhoneSchema.extend({
        phone: z.string().min(12).max(12),
      })
    ),
    defaultValues: {
      id: selectedPhone.id ?? -1,
      phone: selectedPhone.phone ?? "",
      name: selectedPhone.name ?? "",
      status: selectedPhone.status ?? PhoneStatus.NEW,
    },
    values: {
      id: selectedPhone.id ?? -1,
      phone: selectedPhone.phone ?? "",
      name: selectedPhone.name ?? "",
      createdAt: selectedPhone.createdAt ?? new Date(),
      updatedAt: selectedPhone.updatedAt ?? new Date(),
      status: selectedPhone.status ?? PhoneStatus.NEW,
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  const onSubmit = async (phone: Phone) => {
    try {
      await updatePhone(phone);

      toast({
        title: "Success",
        description: "Phone updated successfully.",
      });

      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      toast({
        title: "Error",
        description:
          (error as any)?.response?.data?.message || "Failed to update phone.",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Phone</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="id"
              control={form.control}
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
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>

                  <FormControl>
                    <PhoneInput field={field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
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
              name="status"
              control={form.control}
              render={({ field }) => <PhoneStatusFormItem field={field} />}
            />
            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
