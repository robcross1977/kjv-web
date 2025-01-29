"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { User } from "../types/db";

export async function getUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to get users");
  }
}

export async function updateUser(user: User) {
  console.log(user);
  try {
    const updatedUser = await prisma.user.update({
      where: { uid: user.uid },
      data: user,
    });
    revalidatePath("/user");
    return updatedUser;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to update user");
  }
}

export async function deleteUser(uid: string) {
  try {
    await prisma.user.delete({ where: { uid: Number(uid) } });
    revalidatePath("/user");
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to delete user");
  }
}
