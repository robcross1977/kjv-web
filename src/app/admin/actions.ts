"use server";

import prisma from "@/lib/prisma";
import { Admin, NewAdmin } from "./types";
import { revalidatePath } from "next/cache";

export async function getAdmins() {
  try {
    return await prisma.admin.findMany();
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to get admins");
  }
}

export async function createAdmin(admin: NewAdmin) {
  console.log(admin);
  try {
    const createdAdmin = await prisma.admin.create({ data: admin });
    revalidatePath("/admin");
    return createdAdmin;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to create admin");
  }
}

export async function updateAdmin(admin: Admin) {
  console.log(admin);
  try {
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: admin,
    });
    revalidatePath("/admin");
    return updatedAdmin;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to update admin");
  }
}

export async function deleteAdmin(id: number) {
  try {
    await prisma.admin.delete({ where: { id } });
    revalidatePath("/admin");
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to delete admin");
  }
}
