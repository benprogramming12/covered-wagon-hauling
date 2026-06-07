"use client";
import { useEffect, useState } from "react";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameMonth, isToday, isBefore, startOfToday,
  getDay, addDays,
} from "date-fns";
import Link from "next/link";

type AvailabilityData = {
  bookingCounts: Record<string, number>;
  blockedDates: string[];
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_DAILY_JOBS = 3;

function getDayStatus(
  date: Date,
  data: AvailabilityData | null
): "unavailable" | "blocked" | "busy" | "limited" | "open" | "weekend" {
  const today = startOfToday();
  if (isBefore(date, today)) return "unavailable";

  const dayOfWeek = getDay(date); // 0=Sun, 6=Sat
  const dateStr = format(date, "MMMM d, yyyy");

  if (data?.blockedDates.includes(dateStr)) return "blocked";

  // Weekends are by request only
  if (dayOfWeek === 0 || dayOfWeek === 6) return "weekend";

  const count = data?.bookingCounts[dateStr] ?? 0;
  if (count >= MAX_DAILY_JOBS) return "busy";
  if (count >= MAX_DAILY_JOBS - 1) return "limited";
  return "open";
}

const STATUS_STYLES: Record<string, string> = {
  unavailable: "text-gray-300 cursor-default",
  blocked: "bg-gray-100 text-gray-400 cursor-default",
  busy: "bg-red-50 text-red-400 cursor-default line-through",
  limited: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-pointer border border-yellow-200",
  open: "bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer border border-green-200 font-semibold",
  weekend: "bg-brand-cream text-brand-brown/50 hover:bg-brand-gold-pale cursor-pointer border border-brand-gold/20",
};

const STATUS_LABELS = [
  { color: "bg-green-100 border-green-300", label: "Open" },
  { color: "bg-yellow-100 border-yellow-300", label: "Limited slots" },
  { color: "bg-red-100 border-red-200", label: "Fully booked" },
  { color: "bg-brand-cream border-brand-gold/20", label: "Weekend (by request)" },
  { color: "bg-gray-100 border-gray-200", label: "Unavailable" },
];

export default function AvailabilityCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [selected, setSelected] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const maxMonth = addMonths(new Date(), 2);
  const minMonth = new Date();

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => {
        // If API fails, show calendar with all weekdays as open
        setData({ bookingCounts: {}, blockedDates: [] });
        setLoading(false);
      });
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start so calendar grid aligns to Sunday
  const startPad = getDay(monthStart);
  const paddedDays: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...days,
  ];

  function canGoPrev() {
    const prev = subMonths(currentMonth, 1);
    return !isBefore(startOfMonth(prev), startOfMonth(minMonth));
  }

  function canGoNext() {
    const next = addMonths(currentMonth, 1);
    return !isBefore(startOfMonth(maxMonth), startOfMonth(next));
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {STATUS_LABELS.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded border ${s.color}`} />
            <span className="text-brand-brown/70">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-brand-gold/10 overflow-hidden">
        {/* Month navigation */}
        <div className="flex items-center justify-between px-6 py-4 bg-brand-brown">
          <button
            onClick={() => { setCurrentMonth(subMonths(currentMonth, 1)); setSelected(null); }}
            disabled={!canGoPrev()}
            className="text-brand-gold-pale hover:text-brand-gold disabled:opacity-30 disabled:cursor-default text-2xl font-bold px-2"
          >
            ‹
          </button>
          <h2 className="font-display font-bold text-brand-gold text-xl">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => { setCurrentMonth(addMonths(currentMonth, 1)); setSelected(null); }}
            disabled={!canGoNext()}
            className="text-brand-gold-pale hover:text-brand-gold disabled:opacity-30 disabled:cursor-default text-2xl font-bold px-2"
          >
            ›
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs font-bold text-brand-brown/50 py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div className="py-16 text-center text-gray-400">Loading availability...</div>
        ) : (
          <div className="grid grid-cols-7">
            {paddedDays.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} className="aspect-square" />;
              const status = getDayStatus(day, data);
              const isSelected = selected && format(selected, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
              const isT = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => {
                    if (status === "unavailable") return;
                    setSelected(isSelected ? null : day);
                  }}
                  className={`
                    aspect-square flex flex-col items-center justify-center m-1 rounded-xl text-sm transition-colors
                    ${STATUS_STYLES[status]}
                    ${isSelected ? "ring-2 ring-brand-gold ring-offset-1" : ""}
                    ${isT ? "ring-2 ring-brand-brown/30" : ""}
                  `}
                >
                  <span className={isT ? "font-bold underline" : ""}>{format(day, "d")}</span>
                  {status === "limited" && <span className="text-xs mt-0.5">few left</span>}
                  {status === "busy" && <span className="text-xs mt-0.5">full</span>}
                  {status === "weekend" && <span className="text-xs mt-0.5">request</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected date detail */}
      {selected && (
        <div className="bg-white rounded-2xl shadow border border-brand-gold/20 p-6">
          <h3 className="font-display font-bold text-xl text-brand-brown mb-1">
            {format(selected, "EEEE, MMMM d, yyyy")}
          </h3>
          {(() => {
            const status = getDayStatus(selected, data);
            if (status === "weekend") return (
              <div>
                <p className="text-brand-brown/70 mb-4">Weekends are available by request. Call or submit a quote and we&apos;ll confirm.</p>
                <div className="flex gap-3 flex-wrap">
                  <a href="tel:+12482591036" className="bg-brand-gold text-brand-brown-dark font-bold px-6 py-2 rounded-xl hover:bg-brand-gold-light transition-colors">
                    📞 Call 248.259.1036
                  </a>
                  <Link href="/quote" className="border-2 border-brand-gold text-brand-gold font-bold px-6 py-2 rounded-xl hover:bg-brand-gold hover:text-brand-brown-dark transition-colors">
                    Request a Quote
                  </Link>
                </div>
              </div>
            );
            if (status === "open" || status === "limited") return (
              <div>
                <p className="text-brand-brown/70 mb-1">Available 2:30 PM – late evening</p>
                {status === "limited" && <p className="text-yellow-700 text-sm mb-3">⚠️ Limited slots remaining — book soon.</p>}
                <p className="text-brand-brown/60 text-sm mb-4">Submit a quote request to lock in this date.</p>
                <Link
                  href={`/quote?date=${format(selected, "yyyy-MM-dd")}`}
                  className="bg-brand-gold text-brand-brown-dark font-bold px-6 py-2 rounded-xl hover:bg-brand-gold-light transition-colors inline-block"
                >
                  Request This Date →
                </Link>
              </div>
            );
            if (status === "busy") return <p className="text-red-600">This date is fully booked. Please select another date or call us at <a href="tel:+12482591036" className="font-bold underline">248.259.1036</a>.</p>;
            if (status === "blocked") return <p className="text-gray-500">Not available on this date. Please select another day.</p>;
            return null;
          })()}
        </div>
      )}

      {/* CTA */}
      <div className="text-center bg-brand-brown rounded-2xl p-8">
        <p className="text-brand-gold-pale mb-4">Ready to book? Submit a quote request and we&apos;ll confirm your date fast.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/quote" className="bg-brand-gold text-brand-brown-dark font-bold px-8 py-3 rounded-xl hover:bg-brand-gold-light transition-colors">
            Request a Quote
          </Link>
          <a href="tel:+12482591036" className="border-2 border-brand-gold text-brand-gold font-bold px-8 py-3 rounded-xl hover:bg-brand-gold hover:text-brand-brown-dark transition-colors">
            📞 248.259.1036
          </a>
        </div>
      </div>
    </div>
  );
}
