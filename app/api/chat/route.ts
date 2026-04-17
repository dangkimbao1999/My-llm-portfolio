import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { AppError } from "@/lib/errors";
import { container } from "@/server/container";

const chatRequestSchema = z.object({
  question: z.string().trim().min(1).max(2000),
  topK: z.number().int().min(1).max(10).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = chatRequestSchema.parse(await request.json());
    const result = await container.chatService.ask(payload);

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_JSON",
            message: "Request body must be valid JSON.",
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Request body is invalid.",
            details: error.flatten(),
          },
        },
        { status: 400 },
      );
    }

    const appError =
      error instanceof AppError
        ? error
        : new AppError("Unable to process chat request.", 500, "CHAT_REQUEST_FAILED", error);

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: appError.code,
          message: appError.message,
          details: appError.details,
        },
      },
      { status: appError.statusCode },
    );
  }
}
