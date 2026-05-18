import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma";

export const testimonialRepository = {
  create: async (data: Prisma.TestimonialCreateInput) => {
    return prisma.testimonial.create({ data });
  },
  
  findAllAdmin: async () => {
    return prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findApproved: async () => {
    return prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
  },

  update: async (id: string, data: Prisma.TestimonialUpdateInput) => {
    return prisma.testimonial.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.testimonial.delete({
      where: { id },
    });
  }
};
