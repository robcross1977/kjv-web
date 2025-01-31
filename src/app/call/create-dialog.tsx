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
import CallForm from "./call-form";
import { createCall } from "./actions";
import { Call, CallStatus, Phone } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CallSchema } from "../types/db";
import { z } from "zod";

type CallWithPhone = Call & { phone: Phone };

export default function AddPhoneStatusDialog({ ...props }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<CallWithPhone>({
    resolver: zodResolver(
      CallSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
        phone: z.object({ id: z.number() }),
      })
    ),
    defaultValues: {
      phone: { id: 0 } as Phone,
      script: "",
      status: CallStatus.HOLD,
      notes: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  const onSubmit = async (call: Call) => {
    try {
      await createCall(call);

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
          (error as any)?.response?.data?.message || "Failed to add call.",
      });
    }
  };

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Call</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <CallForm
          form={form as any}
          onSubmit={onSubmit}
          type="insert"
          hideUid={true}
        />
      </DialogContent>
    </Dialog>
  );
}
