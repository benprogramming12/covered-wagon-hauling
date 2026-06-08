"use client";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, addDays, startOfToday } from "date-fns";
import toast from "react-hot-toast";

type BlockedDate = { id: string; date: string; reason?: string };
type RecurringBlock = {
  id: string;
  label: string;
  daysOfWeek: string;
  pattern: string;
  startDate: string;
  endDate?: string;
  active: boolean;
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PATTERN_LABELS: Record<string, string> = {
  weekly: "Every week",
  biweekly: "Every other week",
  custom: "Selected days only (one-time set)",
};

export default function AdminAvailabilityPage() {
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [recurring, setRecurring] = useState<RecurringBlock[]>([]);
  const [selected, setSelected] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Recurring form state
  const [rLabel, setRLabel] = useState("");
  const [rDays, setRDays] = useState<number[]>([]);
  const [rPattern, setRPattern] = useState("weekly");
  const [rStart, setRStart] = useState(format(new Date(), "yyyy-MM-dd"));
  const [rEnd, setREnd] = useState("");
  const [rLoading, setRLoading] = useState(false);

  async function fetchAll() {
    const [b, r] = await Promise.all([
      fetch("/api/admin/blocked-dates").then((r) => r.json()),
      fetch("/api/admin/recurring-blocks").then((r) => r.json()),
    ]);
    setBlocked(b);
    setRecurring(r);
  }

  useEffect(() => { fetchAll(); }, []);

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
      fetchAll();
    } catch { toast.error("Failed"); }
    finally { setLoading(false); }
  }

  async function unblockDate(date: string) {
    await fetch("/api/admin/blocked-dates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    toast.success("Date unblocked");
    fetchAll();
  }

  async function addRecurring() {
    if (!rLabel) return toast.error("Enter a label");
    if (rDays.length === 0) return toast.error("Select at least one day");
    setRLoading(true);
    try {
      await fetch("/api/admin/recurring-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: rLabel,
          daysOfWeek: rDays.join(","),
          pattern: rPattern,
          startDate: rStart,
          endDate: rEnd || null,
        }),
      });
      toast.success("Recurring block added!");
      setRLabel("");
      setRDays([]);
      setRPattern("weekly");
      setREnd("");
      fetchAll();
    } catch { toast.error("Failed"); }
    finally { setRLoading(false); }
  }

  async function deleteRecurring(id: string) {
    await fetch(`/api/admin/recurring-blocks/${id}`, { method: "DELETE" });
    toast.success("Recurring block removed");
    fetchAll();
  }

  async function toggleRecurring(id: string, active: boolean) {
    await fetch(`/api/admin/recurring-blocks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    fetchAll();
  }

  const today = startOfToday();
  const maxDate = addDays(today, 90);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-brown mb-1">Manage Availability</h1>
        <p className="text-gray-500 text-sm">Block specific dates or set up recurring schedules for regular customers.</p>
      </div>

      {/* Recurring blocks */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h2 className="font-bold text-brand-brown text-lg mb-1">Recurring Schedule Blocks</h2>
        <p className="text-gray-400 text-xs mb-5">Use this for regular customers, personal time off, or to make your calendar look busy on certain days.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Label (admin only)</label>
              <input
                type="text"
                value={rLabel}
                onChange={(e) => setRLabel(e.target.value)}
                placeholder="e.g. Weekly Run — Acme Corp, Reserved"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Days of Week</label>
              <div className="flex gap-2 flex-wrap">
                {DAY_NAMES.map((day, i) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setRDays(rDays.includes(i) ? rDays.filter((d) => d !== i) : [...rDays, i])}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
                      rDays.includes(i)
                        ? "bg-brand-gold text-brand-brown-dark border-brand-gold"
                        : "border-gray-200 text-gray-600 hover:border-brand-gold"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Repeat Pattern</label>
              <select
                value={rPattern}
                onChange={(e) => setRPattern(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              >
                <option value="weekly">Every week</option>
                <option value="biweekly">Every other week</option>
                <option value="custom">One-time block (selected days once)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={rStart}
                  onChange={(e) => setRStart(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">End Date (optional)</label>
                <input
                  type="date"
                  value={rEnd}
                  onChange={(e) => setREnd(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>
            </div>

            <button
              onClick={addRecurring}
              disabled={rLoading}
              className="w-full bg-brand-green text-white font-bold py-2 rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50"
            >
              {rLoading ? "Adding..." : "Add Recurring Block"}
            </button>
          </div>

          {/* Active recurring blocks */}
          <div>
            <h3 className="font-semibold text-gray-600 text-sm mb-3">Active Recurring Blocks</h3>
            {recurring.length === 0 ? (
              <p className="text-gray-400 text-sm">No recurring blocks set up yet.</p>
            ) : (
              <ul className="space-y-3">
                {recurring.map((b) => {
                  const days = b.daysOfWeek.split(",").map(Number).map((d) => DAY_NAMES[d]).join(", ");
                  return (
                    <li key={b.id} className={`rounded-xl border p-4 ${b.active ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100 opacity-60"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-brand-brown text-sm">{b.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{days} · {PATTERN_LABELS[b.pattern]}</div>
                          <div className="text-xs text-gray-400">From {b.startDate}{b.endDate ? ` → ${b.endDate}` : " (ongoing)"}</div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 ml-3">
                          <button
                            onClick={() => toggleRecurring(b.id, !b.active)}
                            className={`text-xs font-bold px-2 py-1 rounded-lg border transition-colors ${
                              b.active
                                ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                : "border-green-300 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {b.active ? "Pause" : "Resume"}
                          </button>
                          <button
                            onClick={() => deleteRecurring(b.id)}
                            className="text-xs font-bold px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* One-off date blocker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="font-bold text-brand-brown mb-1">Block a Specific Date</h2>
          <p className="text-gray-400 text-xs mb-4">For vacations, personal days, or one-off unavailability.</p>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            disabled={[{ before: today }, { after: maxDate }]}
            className="border border-brand-gold/20 rounded-xl p-2 bg-brand-cream"
          />
          {selected && (
            <div className="mt-4 space-y-3">
              <p className="font-semibold text-brand-brown">Blocking: {format(selected, "MMMM d, yyyy")}</p>
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

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="font-bold text-brand-brown mb-4">Blocked Specific Dates</h2>
          {blocked.length === 0 ? (
            <p className="text-gray-400 text-sm">No specific dates blocked.</p>
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
