import { NextResponse } from "next/server";
import { format } from "date-fns";

const ADMIN_API = "https://admin.coveredwagonhauling.com/api/public/availability";

export async function GET() {
  try {
    const res = await fetch(ADMIN_API, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Admin API returned ${res.status}`);
    const data = await res.json();

    // bookingCounts from admin uses ISO dates (YYYY-MM-DD).
    // Convert to "MMMM d, yyyy" format that the calendar UI expects.
    const bookingCounts: Record<string, number> = {};
    for (const [isoDate, count] of Object.entries(data.bookingCounts ?? {})) {
      const d = new Date(isoDate + "T12:00:00");
      bookingCounts[format(d, "MMMM d, yyyy")] = count as number;
    }

    // blockedDates from admin are ISO (YYYY-MM-DD) — convert to long format
    const blockedDates: string[] = (data.blockedDates ?? []).map((iso: string) => {
      const d = new Date(iso + "T12:00:00");
      return format(d, "MMMM d, yyyy");
    });

    // Pass hour blocks through as-is for future calendar enhancements
    return NextResponse.json({
      bookingCounts,
      blockedDates,
      hourBlocks: data.hourBlocks ?? [],
    });
  } catch (err) {
    console.error("Availability API error:", err);
    // Fallback: return empty data so calendar still renders
    return NextResponse.json({ bookingCounts: {}, blockedDates: [], hourBlocks: [] });
  }
}
