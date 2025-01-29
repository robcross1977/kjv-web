"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { PhoneStatus } from "../types/db";

export async function getPhoneStatus() {
  return prisma.phoneStatus.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createPhoneStatus(data: { status: string }) {
  const newStatus = await prisma.phoneStatus.create({
    data: {
      status: data.status,
    },
  });
  revalidatePath("/phone-status");
  return newStatus;
}

export async function updatePhoneStatus(phoneStatus: PhoneStatus) {
  const updatedStatus = await prisma.phoneStatus.update({
    where: { id: phoneStatus.id },
    data: phoneStatus,
  });
  revalidatePath("/phone-status");
  return updatedStatus;
}

export async function deletePhoneStatus(id: number) {
  await prisma.phoneStatus.delete({
    where: { id },
  });
  revalidatePath("/phone-status");
}
