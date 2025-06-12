import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { z } from "zod";
import prisma from "@lib/prisma";
import { NextResponse } from "next/server";

/**
 * Request schema for user registration
 */
const RegisterRequestSchema = z.object({
  email: z.string().email(),
  userId: z.string().min(1),
  secret: z.string().min(1),
});

type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

/**
 * Validates the webhook secret
 */
const validateSecret = (secret: string): E.Either<string, string> =>
  pipe(
    O.fromNullable(process.env.AUTH0_HOOK_SECRET),
    E.fromOption(() => "AUTH0_HOOK_SECRET not configured"),
    E.chain((expectedSecret) =>
      secret === expectedSecret
        ? E.right(secret)
        : E.left("Invalid webhook secret")
    )
  );

/**
 * Parses and validates the request body
 */
const parseRequestBody = (body: unknown): E.Either<string, RegisterRequest> =>
  pipe(
    E.tryCatch(
      () => RegisterRequestSchema.parse(body),
      (error) => `Invalid request body: ${error}`
    )
  );

/**
 * Creates a new user in the database
 */
const createUser = (data: RegisterRequest): TE.TaskEither<string, void> =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.user.create({
          data: { uid: data.userId, email: data.email },
        }),
      (error) => `Failed to create user: ${error}`
    ),
    TE.map(() => undefined)
  );

/**
 * Creates error response
 */
const createErrorResponse = (message: string, status: number) =>
  new NextResponse(
    JSON.stringify({
      status: "error",
      message,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );

/**
 * Creates success response
 */
const createSuccessResponse = (email: string) =>
  NextResponse.json({
    message: `User with email: ${email} has been created successfully!`,
  });

/**
 * Main registration handler
 */
export async function POST(req: Request) {
  const result = await pipe(
    TE.tryCatch(
      () => req.json(),
      (error) => `Failed to parse request: ${error}`
    ),
    TE.chainEitherK(parseRequestBody),
    TE.chainEitherK((data) =>
      pipe(
        validateSecret(data.secret),
        E.map(() => data)
      )
    ),
    TE.chain((data) =>
      pipe(
        createUser(data),
        TE.map(() => data)
      )
    )
  )();

  return pipe(
    result,
    E.fold(
      (error) =>
        createErrorResponse(error, error.includes("secret") ? 403 : 400),
      (data) => createSuccessResponse(data.email)
    )
  );
}
