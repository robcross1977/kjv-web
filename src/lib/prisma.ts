import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Uncomment this batch of code if you want to see the
// actual queries being run in real-time in the console
// prisma.$on("query", (q) => {
//   if (process.env.NODE_ENV === "development") {
//     console.log(q);
//   }
// });
