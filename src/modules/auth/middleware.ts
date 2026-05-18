import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { handleApiError, UnauthorizedError, ForbiddenError } from "@/lib/errors";
import type { JwtPayload } from "./types";

export interface WithAuthOptions {
  requireRole?: string | string[];
}

export type AuthenticatedRequest = NextRequest & {
  user: JwtPayload;
};

export type HandlerFunction = (
  req: AuthenticatedRequest,
  ctx: any
) => Promise<Response> | Response;

/**
 * Higher-Order Function (Middleware) for Next.js API Routes.
 * 
 * Wraps an API route handler to enforce JWT authentication.
 * Extracts the token, verifies it, checks roles, and injects the `user` payload into the request.
 */
export function withAuth(handler: HandlerFunction, options?: WithAuthOptions) {
  return async (request: NextRequest, context: any) => {
    try {
      // 1. Extract Token from Authorization header or cookies
      const authHeader = request.headers.get("authorization");
      let token: string | undefined;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        token = request.cookies.get("token")?.value;
      }

      if (!token) {
        throw new UnauthorizedError("Authentication token is missing");
      }

      // 2. Verify JWT
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not configured");
      }

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, secret) as JwtPayload;
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          throw new UnauthorizedError("Token has expired");
        }
        throw new UnauthorizedError("Invalid or malformed token");
      }

      // 3. Role-based protection
      if (options?.requireRole) {
        const allowedRoles = Array.isArray(options.requireRole)
          ? options.requireRole
          : [options.requireRole];

        if (!decoded.role || !allowedRoles.includes(decoded.role)) {
          throw new ForbiddenError("You do not have permission to access this resource");
        }
      }

      // 4. Attach payload to request and call original handler
      const authenticatedReq = request as AuthenticatedRequest;
      authenticatedReq.user = decoded;

      return await handler(authenticatedReq, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
