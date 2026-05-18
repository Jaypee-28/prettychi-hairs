/**
 * Auth Repository
 *
 * Handles all database interactions for the auth module.
 * This is the ONLY layer that should import the Prisma client.
 */

import { prisma } from "../../../lib/db";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name ?? null,
    },
  });
}
