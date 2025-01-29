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
import { Phone } from "@prisma/client";
import { PhoneSchema } from "../types/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

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
    resolver: zodResolver(PhoneSchema),
    defaultValues: {
      id: selectedPhone.id ?? -1,
      number: selectedPhone.number ?? "",
      createdAt: selectedPhone.createdAt ?? new Date(),
      updatedAt: selectedPhone.updatedAt ?? new Date(),
    },
    values: {
      id: selectedPhone.id ?? -1,
      number: selectedPhone.number ?? "",
      createdAt: selectedPhone.createdAt ?? new Date(),
      updatedAt: selectedPhone.updatedAt ?? new Date(),
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  console.dir(form.getValues());
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
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Number" />
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
