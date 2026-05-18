import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma";

export const newsletterRepository = {
  create: async (data: Prisma.NewsletterSubscriberCreateInput) => {
    return prisma.newsletterSubscriber.create({ data });
  },

  findByEmail: async (email: string) => {
    return prisma.newsletterSubscriber.findUnique({ where: { email } });
  },

  findAll: async () => {
    return prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  },

  delete: async (id: string) => {
    return prisma.newsletterSubscriber.delete({ where: { id } });
  }
};
