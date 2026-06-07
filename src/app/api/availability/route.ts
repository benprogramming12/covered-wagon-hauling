import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [quotes, blocked] = await Promise.all([
    prisma.quote.findMany({
      select: { scheduledDate: true, scheduledTime: true, status: true },
    }),
    prisma.blockedDate.findMany({
      select: { date: true, reason: true },
    }),
  ]);

  const activeQuotes = quotes.filter((q) =>
    ["deposit_paid", "quoted", "in_progress"].includes(q.status)
  );

  const bookingCounts: Record<string, number> = {};
  for (const q of activeQuotes) {
    bookingCounts[q.scheduledDate] = (bookingCounts[q.scheduledDate] ?? 0) + 1;
  }

  return NextResponse.json({
    bookingCounts,
    blockedDates: blocked.map((b) => b.date),
  });
}
