import { prisma } from "@/lib/db";
import { CreateFAQInput, UpdateFAQInput } from "./faq.schema";

export const faqRepository = {
  async create(data: CreateFAQInput) {
    return prisma.fAQ.create({ data });
  },

  async findAll(activeOnly: boolean = false) {
    return prisma.fAQ.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [
        { category: 'asc' },
        { createdAt: 'asc' }
      ],
    });
  },

  async findById(id: string) {
    return prisma.fAQ.findUnique({ where: { id } });
  },

  async update(id: string, data: UpdateFAQInput) {
    return prisma.fAQ.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.fAQ.delete({ where: { id } });
  }
};
