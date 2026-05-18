/**
 * Auth module barrel export.
 */
export * as authController from "./controllers/auth.controller";
export * as authService from "./services/auth.service";
export * as authRepository from "./repositories/auth.repository";
export { registerSchema, loginSchema } from "./types";
export type {
  RegisterInput,
  LoginInput,
  AuthResult,
  SafeUser,
  JwtPayload,
} from "./types";
export * from "./middleware";
