import { sendEmail } from "@/lib/resend";

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: {
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

/**
 * Sends order confirmation email to the customer.
 * Wrapped in try/catch — must not crash order creation.
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  try {
    const itemRows = data.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-family: 'Inter', sans-serif; font-size: 14px; color: #374151;">${item.productName}</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-family: 'Inter', sans-serif; font-size: 14px; color: #374151; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-family: 'Inter', sans-serif; font-size: 14px; color: #374151; text-align: right;">₦${item.price.toFixed(2)}</td>
          </tr>`
      )
      .join("");

    const subtotal = data.totalAmount - data.deliveryFee;
    const addressParts = [
      data.deliveryAddress.addressLine1,
      data.deliveryAddress.addressLine2,
      data.deliveryAddress.city,
      data.deliveryAddress.state,
      data.deliveryAddress.postalCode,
      data.deliveryAddress.country,
    ].filter(Boolean);

    const html = `
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; font-family: 'Inter', sans-serif;">
        <div style="background: linear-gradient(135deg, #FF4D8D, #FF80AC); padding: 40px 32px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Order Confirmed ✨</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Thank you for shopping with Pretty Chi Hairs</p>
        </div>
        
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #111827; margin: 0 0 4px;">Hi <strong>${data.customerName}</strong>,</p>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px;">We are processing your order. Here's a summary:</p>
          
          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Order ID</p>
            <p style="margin: 4px 0 0; font-size: 16px; color: #111827; font-weight: 800; font-family: monospace;">${data.orderId}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Product</th>
                <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Qty</th>
                <th style="padding: 10px 16px; text-align: right; font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <div style="border-top: 2px solid #f3f4f6; padding-top: 16px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6b7280;">Subtotal</span>
              <span style="font-size: 14px; color: #374151; font-weight: 600;">₦${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6b7280;">Delivery</span>
              <span style="font-size: 14px; color: #374151; font-weight: 600;">₦${data.deliveryFee.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #111827;">
              <span style="font-size: 16px; color: #111827; font-weight: 800;">Total</span>
              <span style="font-size: 16px; color: #111827; font-weight: 800;">₦${data.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Delivery Address</p>
            <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">${addressParts.join("<br/>")}</p>
          </div>

          <p style="font-size: 13px; color: #9ca3af; text-align: center; margin: 32px 0 0;">Pretty Chi Hairs — Premium Hair & Beauty</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: data.customerEmail,
      subject: `Order Confirmation — #${data.orderId.slice(-8).toUpperCase()}`,
      html,
    });

    console.log(`[Email] Order confirmation sent to ${data.customerEmail} for order ${data.orderId}`);
  } catch (error) {
    console.error(`[Email] Failed to send order confirmation to ${data.customerEmail}:`, error);
  }
}

/**
 * Sends new order alert email to the admin.
 * Wrapped in try/catch — must not crash order creation.
 */
export async function sendNewOrderAdminAlert(data: OrderEmailData): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "hello@prettychihairs.com";

    const html = `
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; font-family: 'Inter', sans-serif;">
        <div style="background: #111827; padding: 32px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800;">🛍️ New Order Received</h1>
        </div>
        
        <div style="padding: 32px;">
          <div style="display: grid; gap: 16px; margin-bottom: 24px;">
            <div style="background: #f9fafb; border-radius: 12px; padding: 16px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700;">Customer</p>
              <p style="margin: 4px 0 0; font-size: 16px; color: #111827; font-weight: 700;">${data.customerName}</p>
              <p style="margin: 2px 0 0; font-size: 14px; color: #6b7280;">${data.customerEmail}</p>
            </div>
            <div style="background: #f0fdf4; border-radius: 12px; padding: 16px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700;">Order Total</p>
              <p style="margin: 4px 0 0; font-size: 24px; color: #16a34a; font-weight: 800;">₦${data.totalAmount.toFixed(2)}</p>
            </div>
            <div style="background: #f9fafb; border-radius: 12px; padding: 16px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700;">Items</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #374151;">${data.items.map((i) => `${i.productName} × ${i.quantity}`).join(", ")}</p>
            </div>
          </div>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/orders" 
             style="display: block; text-align: center; background: #111827; color: #ffffff; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">
            View in Dashboard →
          </a>
        </div>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `New Order — ₦${data.totalAmount.toFixed(2)} from ${data.customerName}`,
      html,
    });

    console.log(`[Email] New order admin alert sent for order ${data.orderId}`);
  } catch (error) {
    console.error(`[Email] Failed to send admin alert for order ${data.orderId}:`, error);
  }
}
