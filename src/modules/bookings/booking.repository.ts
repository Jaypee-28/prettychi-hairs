import { prisma } from "../../lib/db";
import { Prisma } from "@/generated/prisma";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export class BookingRepository {
  async findAll(status?: BookingStatus) {
    return prisma.booking.findMany({
      where: status ? { status } : {},
      include: {
        service: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });
  }

  async create(data: Prisma.BookingCreateInput) {
    return prisma.booking.create({
      data,
      include: {
        service: true,
      },
    });
  }

  async updateStatus(id: string, status: BookingStatus) {
    return prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        service: true,
      },
    });
  }
}

export const bookingRepository = new BookingRepository();
