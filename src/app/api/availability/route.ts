import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [quotes, blocked] = await Promise.all([
    prisma.quote.findMany({
      where: {
        status: { in: ["deposit_paid", "quoted", "in_progress"] },
      },
      select: { scheduledDate: true, scheduledTime: true },
    }),
    prisma.blockedDate.findMany({
      select: { date: true, reason: true },
    }),
  ]);

  // Count bookings per date
  const bookingCounts: Record<string, number> = {};
  for (const q of quotes) {
    bookingCounts[q.scheduledDate] = (bookingCounts[q.scheduledDate] ?? 0) + 1;
  }

  return NextResponse.json({
    bookingCounts,
    blockedDates: blocked.map((b) => b.date),
  });
}
