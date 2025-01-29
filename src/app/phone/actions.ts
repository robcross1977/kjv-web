"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Phone } from "../types/db";

export async function getPhone() {
  return prisma.phone.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createPhone({ number }: Phone) {
  const newPhone = await prisma.phone.create({
    data: {
      number,
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
