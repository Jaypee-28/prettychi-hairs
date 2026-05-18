import { withAuth, type AuthenticatedRequest } from "@/modules/auth";
import type { ApiResponse } from "@/types";

export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const user = request.user;

  const response: ApiResponse<{ user: typeof user }> = {
    success: true,
    data: { user },
  };

  return Response.json(response, { status: 200 });
});
