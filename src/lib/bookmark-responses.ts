import { NextResponse } from "next/server";

/**
 * Creates error response
 */
export const createErrorResponse = (error: string, status: number = 400) =>
  NextResponse.json({ error }, { status });

/**
 * Creates success response
 */
export const createSuccessResponse = (data: any, status: number = 200) =>
  NextResponse.json(data, { status });
