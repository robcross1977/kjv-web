"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Phone } from "../types/db";
import { PhoneStatus } from "@prisma/client";

export async function getPhone() {
  return prisma.phone.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createPhone({ phone, name }: Phone) {
  const newPhone = await prisma.phone.create({
    data: {
      phone,
      name,
      status: PhoneStatus.NEW,
    },
  });
  revalidatePath("/phone");
  return newPhone;
}

export async function updatePhone(phone: Phone) {
  const updatedPhone = await prisma.phone.update({
    where: { id: phone.id },
    data: phone,
  });
  revalidatePath("/phone");
  return updatedPhone;
}

export async function deletePhone(id: number) {
  await prisma.phone.delete({
    where: { id },
  });
  revalidatePath("/phone");
}
