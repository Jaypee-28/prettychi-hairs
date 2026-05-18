import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { TIME_SLOTS } from "@/modules/bookings/booking.schema";
import { startOfMonth, endOfMonth, parseISO, format } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let startDate: Date;
    let endDate: Date;

    if (month && year) {
      // Create a date for the first day of the requested month
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = endOfMonth(startDate);
    } else {
      // Default to current month
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    }

    // Fetch active bookings for the month
    const bookings = await prisma.booking.findMany({
      where: {
        preferredDate: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      select: {
        preferredDate: true,
        preferredTime: true,
      },
    });

    // Group bookings by date
    const bookedSlotsByDate: Record<string, string[]> = {};
    
    bookings.forEach((booking) => {
      // Format as YYYY-MM-DD using local time part of the Date
      const dateStr = format(booking.preferredDate, "yyyy-MM-dd");
      
      if (!bookedSlotsByDate[dateStr]) {
        bookedSlotsByDate[dateStr] = [];
      }
      bookedSlotsByDate[dateStr].push(booking.preferredTime);
    });

    // Calculate available slots for dates that have bookings
    const availabilityMap: Record<string, string[]> = {};
    
    // We'll only return days that have at least one booking to keep the payload small.
    // The frontend will assume any day NOT in the map has ALL slots available.
    Object.keys(bookedSlotsByDate).forEach((dateStr) => {
      const bookedSlots = bookedSlotsByDate[dateStr];
      const availableSlots = TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
      availabilityMap[dateStr] = availableSlots;
    });

    return NextResponse.json(availabilityMap);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
