import prisma from "@lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, userId, secret } = body;

  if (secret !== process.env.AUTH0_HOOK_SECRET) {
    const error_response = {
      status: "error",
      message: `You must provide the secret 🤫`,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (email && userId) {
    await prisma.user.create({
      data: { uid: userId, email },
    });
  }

  return NextResponse.json({
    message: `User with email: ${email} has been created successfully!`,
  });
}
