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
import { UseFormReturn } from "react-hook-form";
import { updatePhoneStatus } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { PhoneStatus } from "@prisma/client";

export default function EditSheet({
  open,
  setOpen,
  form,
  phoneStatus: { id, status },
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<PhoneStatus>;
  phoneStatus: PhoneStatus;
}) {
  const { toast } = useToast();
  if (!form.formState.isDirty) {
    form.setValue("id", id);
    form.setValue("status", status);
  }

  const onSubmit = async (phoneStatus: PhoneStatus) => {
    try {
      await updatePhoneStatus(phoneStatus);

      toast({
        title: "Success",
        description: "Phone status updated successfully.",
      });

      form.reset();

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
