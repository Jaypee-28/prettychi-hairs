import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/modules/bookings/booking.service";
import { bookingSchema } from "@/modules/bookings/booking.schema";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as BookingStatus | undefined;
    const bookings = await bookingService.getAllBookings(status);
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = bookingSchema.parse(body);
    const booking = await bookingService.createBooking(validatedData);
    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
