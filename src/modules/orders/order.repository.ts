import { prisma } from "../../lib/db";
import { CreateOrderInput } from "./order.schema";
import { OrderStatus, PaymentStatus } from "@/generated/prisma";

export class OrderRepository {
  async createOrder(data: CreateOrderInput & { userId?: string, totalAmount: number, deliveryFee: number }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          country: data.country,
          state: data.state,
          city: data.city,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          postalCode: data.postalCode,
          totalAmount: data.totalAmount,
          deliveryFee: data.deliveryFee,
          status: "PENDING",
          paymentStatus: "PENDING",
          currency: "GBP",
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
              variantSnapshot: item.variantSnapshot,
              imageUrl: item.imageUrl
            }))
          }
        },
        include: {
          items: true
        }
      });

      return order;
    });
  }

  /**
   * Fetches all orders with user and items relations.
   * Used by the admin orders dashboard.
   */
  async findAll() {
    return prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async updateStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        paymentStatus
      }
    });
  }

  async updateStripePaymentIntent(id: string, paymentIntentId: string) {
    return prisma.order.update({
      where: { id },
      data: {
        stripePaymentIntentId: paymentIntentId
      }
    });
  }
}

export const orderRepository = new OrderRepository();
