import { prisma } from "@/lib/prisma";
import { Call } from "@prisma/client";

export async function getCalls() {
  const calls = await prisma.call.findMany({
    include: {
      phone: true,
    },
  });
  return calls;
}

export async function createCall(call: Call) {
  await prisma.call.create({
    data: call,
  });
}

export async function updateCall(call: Call) {
  await prisma.call.update({
    where: { id: call.id },
    data: call,
  });
}

export async function deleteCall(id: number) {
  await prisma.call.delete({
    where: { id },
  });
}
