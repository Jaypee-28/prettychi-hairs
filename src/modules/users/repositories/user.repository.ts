import { prisma } from "@/lib/db";
import { UpdateProfileInput } from "../types/user.schema";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(id: string, data: UpdateProfileInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    // Hard delete — cascades sessions/accounts via Prisma onDelete: Cascade
    // Orders remain with userId set to null (FK is optional)
    return prisma.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
