import { bookingRepository } from "./booking.repository";
import { BookingInput } from "./booking.schema";
import { sendEmail } from "../../lib/resend";
import { prisma } from "@/lib/db";
type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export class BookingService {
  async getAllBookings(status?: BookingStatus) {
    return bookingRepository.findAll(status);
  }

  async getBookingById(id: string) {
    return bookingRepository.findById(id);
  }

  async createBooking(data: BookingInput) {
    const { serviceId, ...restData } = data;

    // Start of day and end of day for the requested date to handle timezone differences
    const requestedDate = new Date(restData.preferredDate);
    const startOfDay = new Date(requestedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(requestedDate.setHours(23, 59, 59, 999));

    // Check for double booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        preferredDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        preferredTime: restData.preferredTime,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (existingBooking) {
      throw new Error("This time slot is no longer available. Please select another time.");
    }

    const booking = await bookingRepository.create({
      ...restData,
      status: "PENDING",
      service: { connect: { id: serviceId } },
    });

    // Send emails (non-blocking — don't crash booking creation)
    this.sendBookingEmails(booking).catch((err) => {
      console.error("[BookingService] Email dispatch failed:", err);
    });

    return booking;
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    return bookingRepository.updateStatus(id, status);
  }

  private async sendBookingEmails(booking: any) {
    const { name, email, preferredDate, preferredTime, service } = booking;
    const formattedDate = new Date(preferredDate).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // User Confirmation Email
    try {
      await sendEmail({
        to: email,
        subject: "Booking Confirmed — Pretty Chi Hairs",
        html: `
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; font-family: 'Inter', sans-serif;">
            <div style="background: linear-gradient(135deg, #FF4D8D, #FF80AC); padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Booking Received 💇‍♀️</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">We'll confirm your appointment shortly</p>
            </div>
            
            <div style="padding: 32px;">
              <p style="font-size: 16px; color: #111827; margin: 0 0 24px;">Hi <strong>${name}</strong>,</p>
              
              <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Service</p>
                  <p style="margin: 4px 0 0; font-size: 16px; color: #111827; font-weight: 700;">${service?.name || "Hair Service"}</p>
                </div>
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Date</p>
                  <p style="margin: 4px 0 0; font-size: 16px; color: #111827; font-weight: 700;">${formattedDate}</p>
                </div>
                <div>
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Time</p>
                  <p style="margin: 4px 0 0; font-size: 16px; color: #111827; font-weight: 700;">${preferredTime}</p>
                </div>
              </div>

              <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 24px;">
                We will review your booking and confirm it shortly. You'll receive another email once confirmed. If you need to make changes, please contact us.
              </p>

              <p style="font-size: 13px; color: #9ca3af; text-align: center; margin: 24px 0 0;">
                Thank you for choosing Pretty Chi Hairs ✨<br/>Premium Hair & Beauty
              </p>
            </div>
          </div>
        `,
      });
      console.log(`[Email] Booking confirmation sent to ${email}`);
    } catch (error) {
      console.error(`[Email] Failed to send booking confirmation to ${email}:`, error);
    }

    // Admin Alert Email
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "hello@prettychihairs.com";
      await sendEmail({
        to: adminEmail,
        subject: `New Booking — ${name} for ${service?.name || "Service"}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; font-family: 'Inter', sans-serif;">
            <div style="background: #111827; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800;">📅 New Booking Request</h1>
            </div>
            
            <div style="padding: 32px;">
              <div style="display: grid; gap: 12px; margin-bottom: 24px;">
                <div style="background: #f9fafb; border-radius: 12px; padding: 16px;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700;">Customer</p>
                  <p style="margin: 4px 0 0; font-size: 16px; color: #111827; font-weight: 700;">${name}</p>
                  <p style="margin: 2px 0 0; font-size: 14px; color: #6b7280;">${email}</p>
                  <p style="margin: 2px 0 0; font-size: 14px; color: #6b7280;">${booking.phone || ""}</p>
                </div>
                <div style="background: #fdf2f8; border-radius: 12px; padding: 16px; border: 1px solid #fce7f3;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700;">Service</p>
                  <p style="margin: 4px 0 0; font-size: 16px; color: #be185d; font-weight: 700;">${service?.name || "Service"}</p>
                </div>
                <div style="background: #f9fafb; border-radius: 12px; padding: 16px;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700;">Date & Time</p>
                  <p style="margin: 4px 0 0; font-size: 16px; color: #111827; font-weight: 700;">${formattedDate} at ${preferredTime}</p>
                </div>
                ${booking.notes ? `
                <div style="background: #fffbeb; border-radius: 12px; padding: 16px; border: 1px solid #fef3c7;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700;">Notes</p>
                  <p style="margin: 4px 0 0; font-size: 14px; color: #374151;">${booking.notes}</p>
                </div>
                ` : ""}
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/bookings" 
                 style="display: block; text-align: center; background: #111827; color: #ffffff; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">
                View in Dashboard →
              </a>
            </div>
          </div>
        `,
      });
      console.log(`[Email] Booking admin alert sent for ${name}`);
    } catch (error) {
      console.error(`[Email] Failed to send booking admin alert:`, error);
    }
  }
}

export const bookingService = new BookingService();
