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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import PhoneStatusForm from "./phone-status-form";
import { createPhoneStatus } from "./actions";
import { PhoneStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneStatusSchema } from "../types/db";

export default function AddPhoneStatusDialog({ ...props }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<PhoneStatus>({
    resolver: zodResolver(PhoneStatusSchema),
    defaultValues: {
      id: NaN,
      status: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  const onSubmit = async (phoneStatus: PhoneStatus) => {
    try {
      await createPhoneStatus(phoneStatus);

      toast({
        title: "Success",
        description: "Phone status added successfully.",
      });

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
