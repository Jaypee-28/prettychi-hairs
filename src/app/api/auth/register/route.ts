import { NextRequest } from "next/server";
import * as authController from "@/modules/auth/controllers/auth.controller";
import { handleApiError } from "@/lib/errors";
import type { ApiResponse } from "@/types";
import type { AuthResult } from "@/modules/auth/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await authController.register(body);

    const response: ApiResponse<AuthResult> = {
      success: true,
      data: result,
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
