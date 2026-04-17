import { NextResponse } from "next/server";

import { AppError } from "@/lib/errors";
import { container } from "@/server/container";

export async function GET() {
  try {
    const status = await container.healthService.getStatus();

    return NextResponse.json(
      {
        ok: status.ok,
        data: status,
      },
      { status: status.ok ? 200 : 503 },
    );
  } catch (error) {
    const appError =
      error instanceof AppError
        ? error
        : new AppError("Health check failed.", 503, "HEALTH_CHECK_FAILED", error);

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
