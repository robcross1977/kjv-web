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
import PhoneStatusForm from "./phone-status-form";
import { createPhoneStatus } from "./actions";
import { PhoneStatus } from "@prisma/client";

export default function AddPhoneStatusDialog({
  form,
  ...props
}: {
  form: UseFormReturn<PhoneStatus, unknown, undefined>;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const onSubmit = async (phoneStatus: PhoneStatus) => {
    try {
      await createPhoneStatus(phoneStatus);

      toast({
        title: "Success",
        description: "Phone status added successfully.",
      });

      form.reset();

      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      toast({
        title: "Error",
        description:
          (error as any)?.response?.data?.message ||
          "Failed to add phone status.",
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
          <DialogTitle>Add Phone Status</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <PhoneStatusForm
          form={form}
          onSubmit={onSubmit}
          type="insert"
          hideUid={true}
        />
      </DialogContent>
    </Dialog>
  );
}
