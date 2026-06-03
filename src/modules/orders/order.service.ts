import { orderRepository } from "./order.repository";
import { CreateOrderInput } from "./order.schema";
import { OrderStatus, PaymentStatus } from "@/generated/prisma";
import { settingService } from "../settings/setting.service";
import { sendOrderConfirmationEmail, sendNewOrderAdminAlert } from "../emails/order-emails";

export class OrderService {
  /**
   * Calculates delivery fee dynamically from admin settings.
   */
  private async calculateDeliveryFee(country: string): Promise<number> {
    return settingService.getDeliveryFee(country);
  }

  async createOrder(data: CreateOrderInput, userId?: string) {
    // 1. Calculate totals with dynamic delivery fee
    const itemsTotal = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = await this.calculateDeliveryFee(data.country);
    const totalAmount = itemsTotal + deliveryFee;

    // 2. Delegate to repository for atomic transaction
    const order = await orderRepository.createOrder({
      ...data,
      userId,
      totalAmount,
      deliveryFee
    });

    return order;
  }

  async getOrder(id: string) {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error("Order not found");
    return order;
  }

  async getUserOrders(userId: string) {
    return orderRepository.findByUserId(userId);
  }

  async getAllOrders() {
    return orderRepository.findAll();
  }

  async updateOrderStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    const order = await orderRepository.updateStatus(id, status, paymentStatus);

    if (paymentStatus === "SUCCESS") {
      const emailData = {
        orderId: order.id,
        customerName: order.fullName,
        customerEmail: order.email,
        items: order.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        totalAmount: Number(order.totalAmount),
        deliveryFee: Number(order.deliveryFee),
        deliveryAddress: {
          addressLine1: order.addressLine1,
          addressLine2: order.addressLine2 || "",
          city: order.city,
          state: order.state || "",
          postalCode: order.postalCode || "",
          country: order.country,
        },
      };

      Promise.all([
        sendOrderConfirmationEmail(emailData),
        sendNewOrderAdminAlert(emailData),
      ]).catch((err) => {
        console.error("[OrderService] Email dispatch failed:", err);
      });
    }

    return order;
  }

  async updatePaystackReference(id: string, reference: string) {
    return orderRepository.updatePaystackReference(id, reference);
  }
}

export const orderService = new OrderService();
