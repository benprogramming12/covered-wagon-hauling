"use client";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import toast from "react-hot-toast";

const TIME_SLOTS = [
  "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM",
  "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
  "10:00 PM", "10:30 PM", "11:00 PM",
];

const CARGO_SIZES = [
  { value: "small", label: "Small — loose freight / packages up to 200 lbs" },
  { value: "medium", label: "Medium — multi-piece or equipment 200–800 lbs" },
  { value: "skid", label: "Skid / Pallet — up to 1 ton (2,000 lbs)" },
];

export default function QuoteForm() {
  const [selected, setSelected] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    pickupAddress: "", dropoffAddress: "",
    cargoDescription: "", cargoSize: "", notes: "",
    paymentPreference: "deposit",
  });

  const today = startOfToday();
  const maxDate = addDays(today, 60);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return toast.error("Please select a date.");
    if (!timeSlot) return toast.error("Please select a time slot.");

    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          scheduledDate: format(selected, "MMMM d, yyyy"),
          scheduledTime: timeSlot,
          paymentPreference: form.paymentPreference,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-brand-gold/20">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-display text-2xl font-bold text-brand-brown mb-3">Quote Request Received!</h2>
        <p className="text-brand-brown/70 max-w-md mx-auto">
          Thanks! We&apos;ll review your request and reach out to you shortly — usually within the hour — with pricing details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-brand-gold/20 space-y-6">
      {/* Contact info */}
      <div>
        <h2 className="font-display font-bold text-xl text-brand-brown mb-4 pb-2 border-b border-brand-gold/20">Your Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name *" name="name" value={form.name} onChange={handleChange} required />
          <Field label="Phone Number *" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          <Field label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} required className="sm:col-span-2" />
        </div>
      </div>

      {/* Job details */}
      <div>
        <h2 className="font-display font-bold text-xl text-brand-brown mb-4 pb-2 border-b border-brand-gold/20">Job Details</h2>
        <div className="space-y-4">
          <Field label="Pickup Address *" name="pickupAddress" value={form.pickupAddress} onChange={handleChange} required />
          <Field label="Drop-off Address *" name="dropoffAddress" value={form.dropoffAddress} onChange={handleChange} required />
          <div>
            <label className="block text-sm font-semibold text-brand-brown mb-1">Cargo Size *</label>
            <select
              name="cargoSize"
              value={form.cargoSize}
              onChange={handleChange}
              required
              className="w-full border border-brand-brown/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold text-brand-brown bg-white"
            >
              <option value="">Select cargo size...</option>
              {CARGO_SIZES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-brown mb-1">Cargo Description *</label>
            <textarea
              name="cargoDescription"
              value={form.cargoDescription}
              onChange={handleChange}
              required
              rows={3}
              placeholder="What are we hauling? e.g. couch and dining table, 20 boxes of office supplies..."
              className="w-full border border-brand-brown/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold text-brand-brown resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-brown mb-2">Payment Preference</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: "deposit", label: "50% Deposit", desc: "Pay half now to confirm, balance on delivery" },
                { value: "cod", label: "Cash on Delivery", desc: "Pay full amount by card or cash on delivery" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
                    form.paymentPreference === opt.value
                      ? "border-brand-gold bg-brand-gold-pale"
                      : "border-brand-brown/20 hover:border-brand-gold/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentPreference"
                    value={opt.value}
                    checked={form.paymentPreference === opt.value}
                    onChange={handleChange}
                    className="mt-1 accent-brand-gold"
                  />
                  <div>
                    <div className="font-semibold text-brand-brown text-sm">{opt.label}</div>
                    <div className="text-brand-brown/60 text-xs">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-brown mb-1">Additional Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Stairs, special handling, access codes, anything we should know..."
              className="w-full border border-brand-brown/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold text-brand-brown resize-none"
            />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <h2 className="font-display font-bold text-xl text-brand-brown mb-4 pb-2 border-b border-brand-gold/20">
          Pick a Date &amp; Time
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={setSelected}
              disabled={[{ before: today }, { after: maxDate }]}
              modifiersClassNames={{ selected: "rdp-day_selected" }}
              className="border border-brand-gold/20 rounded-xl p-2 bg-brand-cream"
            />
          </div>
          {selected && (
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-brown mb-3">
                Available times for <strong>{format(selected, "EEEE, MMMM d")}</strong>:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`text-sm px-3 py-2 rounded-lg border font-medium transition-colors ${
                      timeSlot === slot
                        ? "bg-brand-gold text-brand-brown-dark border-brand-gold"
                        : "border-brand-brown/20 text-brand-brown hover:border-brand-gold hover:bg-brand-gold-pale"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!selected && (
            <div className="flex-1 flex items-center justify-center text-brand-brown/40 text-sm italic">
              ← Select a date to see available times
            </div>
          )}
        </div>
        {selected && timeSlot && (
          <div className="mt-4 bg-brand-gold-pale border border-brand-gold/30 rounded-lg px-4 py-3 text-brand-brown font-semibold text-sm">
            ✓ Selected: {format(selected, "MMMM d, yyyy")} at {timeSlot}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-gold text-brand-brown-dark font-bold text-lg py-4 rounded-xl hover:bg-brand-gold-light transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Quote Request"}
      </button>

      <p className="text-xs text-brand-brown/40 text-center">
        No payment required now. We&apos;ll review and send you a quote before anything is charged.
      </p>
    </form>
  );
}

function Field({
  label, name, value, onChange, type = "text", required, className, placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-brand-brown mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-brand-brown/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold text-brand-brown bg-white"
      />
    </div>
  );
}
