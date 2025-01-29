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
import PhoneForm from "./phone-form";
import { createPhone } from "./actions";
import { Phone } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneSchema } from "../types/db";

export default function AddPhoneStatusDialog({ ...props }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<Phone>({
    resolver: zodResolver(
      PhoneSchema.omit({ id: true, createdAt: true, updatedAt: true })
    ),
    defaultValues: {
      number: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  const onSubmit = async (phone: Phone) => {
    try {
      await createPhone(phone);

      toast({
        title: "Success",
        description: "Phone added successfully.",
      });

      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      toast({
        title: "Error",
        description:
          (error as any)?.response?.data?.message || "Failed to add phone.",
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
          <DialogTitle>Add Phone</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <PhoneForm
          form={form}
          onSubmit={onSubmit}
          type="insert"
          hideUid={true}
        />
      </DialogContent>
    </Dialog>
  );
}
