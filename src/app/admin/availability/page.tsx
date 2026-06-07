"use client";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, addDays, startOfToday } from "date-fns";
import toast from "react-hot-toast";

type BlockedDate = { id: string; date: string; reason?: string };

export default function AdminAvailabilityPage() {
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [selected, setSelected] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchBlocked() {
    const res = await fetch("/api/admin/blocked-dates");
    const data = await res.json();
    setBlocked(data);
  }

  useEffect(() => { fetchBlocked(); }, []);

  async function blockDate() {
    if (!selected) return toast.error("Select a date first");
    setLoading(true);
    try {
      await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: format(selected, "MMMM d, yyyy"), reason }),
      });
      toast.success(`${format(selected, "MMM d")} blocked`);
      setSelected(undefined);
      setReason("");
      fetchBlocked();
    } catch {
      toast.error("Failed to block date");
    } finally {
      setLoading(false);
    }
  }

  async function unblockDate(date: string) {
    await fetch("/api/admin/blocked-dates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    toast.success("Date unblocked");
    fetchBlocked();
  }

  const today = startOfToday();
  const maxDate = addDays(today, 90);
  const blockedDateStrings = blocked.map((b) => b.date);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-brown mb-2">Manage Availability</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Block dates you&apos;re unavailable (vacations, personal days, etc.). Customers will see those days as unavailable on the public calendar.
        Weekends already show as "by request" automatically.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Date picker to block */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="font-bold text-brand-brown mb-4">Block a Date</h2>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            disabled={[{ before: today }, { after: maxDate }]}
            className="border border-brand-gold/20 rounded-xl p-2 bg-brand-cream"
          />
          {selected && (
            <div className="mt-4 space-y-3">
              <p className="font-semibold text-brand-brown">
                Blocking: {format(selected, "MMMM d, yyyy")}
              </p>
              <input
                type="text"
                placeholder="Reason (optional, admin only)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <button
                onClick={blockDate}
                disabled={loading}
                className="w-full bg-red-600 text-white font-bold py-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Blocking..." : "Block This Date"}
              </button>
            </div>
          )}
        </div>

        {/* List of blocked dates */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="font-bold text-brand-brown mb-4">Currently Blocked Dates</h2>
          {blocked.length === 0 ? (
            <p className="text-gray-400 text-sm">No dates blocked. You&apos;re available Mon–Fri by default.</p>
          ) : (
            <ul className="space-y-2">
              {blocked.map((b) => (
                <li key={b.id} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <div>
                    <span className="font-semibold text-red-800 text-sm">{b.date}</span>
                    {b.reason && <span className="text-red-500 text-xs ml-2">— {b.reason}</span>}
                  </div>
                  <button
                    onClick={() => unblockDate(b.date)}
                    className="text-xs text-red-600 hover:text-red-800 font-bold border border-red-200 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Unblock
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
