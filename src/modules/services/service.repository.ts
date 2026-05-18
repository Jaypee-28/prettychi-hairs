import { prisma } from "../../lib/db";
import { Prisma } from "@/generated/prisma";

export class ServiceRepository {
  async findAll(includeInactive = false) {
    return prisma.service.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.service.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return prisma.service.findUnique({
      where: { slug },
    });
  }

  async create(data: Prisma.ServiceCreateInput) {
    return prisma.service.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ServiceUpdateInput) {
    return prisma.service.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    // Soft delete by setting isActive to false
    return prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const serviceRepository = new ServiceRepository();
