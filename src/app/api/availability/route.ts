import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { format, addDays, parseISO, differenceInWeeks } from "date-fns";

function getBlockedDatesFromRecurring(blocks: {
  daysOfWeek: string;
  pattern: string;
  startDate: string;
  endDate: string | null;
}[]): string[] {
  const result: Set<string> = new Set();
  const today = new Date();
  const lookAhead = addDays(today, 90);

  for (const block of blocks) {
    const days = block.daysOfWeek.split(",").map(Number);
    const start = parseISO(block.startDate);
    const end = block.endDate ? parseISO(block.endDate) : lookAhead;

    let cursor = new Date(today);
    while (cursor <= end && cursor <= lookAhead) {
      const dayOfWeek = cursor.getDay();
      if (days.includes(dayOfWeek)) {
        if (block.pattern === "weekly") {
          result.add(format(cursor, "MMMM d, yyyy"));
        } else if (block.pattern === "biweekly") {
          const weeksDiff = differenceInWeeks(cursor, start);
          if (weeksDiff % 2 === 0) {
            result.add(format(cursor, "MMMM d, yyyy"));
          }
        } else {
          result.add(format(cursor, "MMMM d, yyyy"));
        }
      }
      cursor = addDays(cursor, 1);
    }
  }

  return Array.from(result);
}

export async function GET() {
  const [quotes, blocked, recurring] = await Promise.all([
    prisma.quote.findMany(),
    prisma.blockedDate.findMany(),
    prisma.recurringBlock.findMany({ where: { active: true } }),
  ]);

  const activeStatuses = ["deposit_paid", "quoted", "in_progress"];
  const bookingCounts: Record<string, number> = {};
  for (const q of quotes) {
    if (activeStatuses.includes(q.status)) {
      bookingCounts[q.scheduledDate] = (bookingCounts[q.scheduledDate] ?? 0) + 1;
    }
  }

  const recurringBlockedDates = getBlockedDatesFromRecurring(recurring);
  const allBlockedDates = [
    ...blocked.map((b) => b.date),
    ...recurringBlockedDates,
  ];

  return NextResponse.json({
    bookingCounts,
    blockedDates: allBlockedDates,
  });
}
