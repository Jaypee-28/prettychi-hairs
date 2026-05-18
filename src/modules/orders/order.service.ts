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

    // 3. Send emails (non-blocking — failures are logged, not thrown)
    const emailData = {
      orderId: order.id,
      customerName: data.fullName,
      customerEmail: data.email,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      totalAmount,
      deliveryFee,
      deliveryAddress: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
      },
    };

    // Fire emails in parallel, don't await blocking
    Promise.all([
      sendOrderConfirmationEmail(emailData),
      sendNewOrderAdminAlert(emailData),
    ]).catch((err) => {
      console.error("[OrderService] Email dispatch failed:", err);
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
    return orderRepository.updateStatus(id, status, paymentStatus);
  }
}

export const orderService = new OrderService();
