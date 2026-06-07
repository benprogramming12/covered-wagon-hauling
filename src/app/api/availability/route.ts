import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [quotes, blocked] = await Promise.all([
    prisma.quote.findMany(),
    prisma.blockedDate.findMany(),
  ]);

  const activeStatuses = ["deposit_paid", "quoted", "in_progress"];
  const bookingCounts: Record<string, number> = {};
  for (const q of quotes) {
    if (activeStatuses.includes(q.status)) {
      bookingCounts[q.scheduledDate] = (bookingCounts[q.scheduledDate] ?? 0) + 1;
    }
  }

  return NextResponse.json({
    bookingCounts,
    blockedDates: blocked.map((b) => b.date),
  });
}
