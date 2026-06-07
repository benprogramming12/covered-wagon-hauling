"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Quote = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  cargoDescription: string;
  cargoSize: string;
  notes?: string;
  status: string;
  price?: number;
  depositPaid: boolean;
  balancePaid: boolean;
  depositAmount?: number;
  balanceAmount?: number;
  paymentPreference: string;
  paymentToken?: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  quoted: "bg-blue-100 text-blue-800",
  deposit_paid: "bg-green-100 text-green-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Review",
  quoted: "Quote Sent",
  deposit_paid: "Deposit Paid ✓",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [paymentLinks, setPaymentLinks] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  async function fetchQuotes() {
    const res = await fetch("/api/admin/quotes");
    const data = await res.json();
    setQuotes(data);
    setLoading(false);
  }

  useEffect(() => { fetchQuotes(); }, []);

  const filtered = quotes.filter((q) => filter === "all" || q.status === filter);

  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === "pending").length,
    depositPaid: quotes.filter((q) => q.depositPaid && !q.balancePaid).length,
    completed: quotes.filter((q) => q.status === "completed").length,
  };

  async function generatePaymentLink(quoteId: string) {
    const price = parseFloat(priceInputs[quoteId]);
    if (!price || price <= 0) return toast.error("Enter a valid price first");
    setActionLoading(quoteId + "_quote");
    try {
      const res = await fetch("/api/stripe/generate-payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPaymentLinks({ ...paymentLinks, [quoteId]: data.url });
      fetchQuotes();
    } catch {
      toast.error("Failed to generate link.");
    } finally {
      setActionLoading(null);
    }
  }

  async function copyLink(quoteId: string, url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(quoteId);
    toast.success("Link copied! Send it to your customer.");
    setTimeout(() => setCopied(null), 3000);
  }

  async function chargeBalance(quoteId: string) {
    if (!confirm("Charge the customer's card for the remaining balance now?")) return;
    setActionLoading(quoteId + "_balance");
    try {
      const res = await fetch("/api/stripe/charge-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Balance collected! Job marked as completed.");
      fetchQuotes();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to charge balance.");
    } finally {
      setActionLoading(null);
    }
  }

  async function updateStatus(quoteId: string, status: string) {
    await fetch(`/api/admin/quotes/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchQuotes();
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading quotes...</div>;
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Requests", value: stats.total, color: "bg-brand-brown" },
          { label: "Pending Review", value: stats.pending, color: "bg-yellow-600" },
          { label: "Awaiting Final Pay", value: stats.depositPaid, color: "bg-green-700" },
          { label: "Completed", value: stats.completed, color: "bg-gray-600" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} text-white rounded-xl p-5 shadow`}>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm opacity-80 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "quoted", "deposit_paid", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === f
                ? "bg-brand-gold text-brand-brown-dark"
                : "bg-white text-gray-600 hover:bg-gray-100 border"
            }`}
          >
            {f === "all" ? "All" : STATUS_LABELS[f] ?? f}
          </button>
        ))}
      </div>

      {/* Quotes list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow">
          No quotes found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
              {/* Header row */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 cursor-pointer hover:bg-gray-50 gap-3"
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              >
                <div className="flex items-start gap-4">
                  <div>
                    <div className="font-bold text-brand-brown">{q.name}</div>
                    <div className="text-sm text-gray-500">{q.email} · {q.phone}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      📅 {q.scheduledDate} at {q.scheduledTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {q.price && (
                    <div className="text-right text-sm">
                      <div className="font-bold text-brand-brown">${q.price.toFixed(2)}</div>
                      <div className="text-gray-400 text-xs">total</div>
                    </div>
                  )}
                  {q.paymentPreference === "cod" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                      💵 COD
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[q.status] ?? "bg-gray-100"}`}>
                    {STATUS_LABELS[q.status] ?? q.status}
                  </span>
                  <span className="text-gray-400">{expanded === q.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === q.id && (
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <InfoRow label="Pickup" value={q.pickupAddress} />
                    <InfoRow label="Drop-off" value={q.dropoffAddress} />
                    <InfoRow label="Cargo Size" value={q.cargoSize} />
                    <InfoRow label="Cargo Description" value={q.cargoDescription} />
                    {q.notes && <InfoRow label="Notes" value={q.notes} className="md:col-span-2" />}
                    <InfoRow label="Submitted" value={new Date(q.createdAt).toLocaleString()} />
                    <InfoRow label="Payment Preference" value={q.paymentPreference === "cod" ? "💵 Cash on Delivery (COD) — collect full payment in person" : "50% Deposit + Balance on Delivery"} className="md:col-span-2" />
                    <InfoRow label="Payment Status" value={
                      q.balancePaid ? "Fully paid ✓" :
                      q.depositPaid ? `Deposit paid ($${q.depositAmount?.toFixed(2)}) — Balance due: $${q.balanceAmount?.toFixed(2)}` :
                      q.price ? "Awaiting deposit" : "Not quoted yet"
                    } />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {/* Generate payment link */}
                    {(q.status === "pending" || q.status === "quoted") && !q.depositPaid && (
                      <div className="space-y-3 w-full">
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="text-sm font-semibold text-gray-600">Total Price: $</span>
                          <input
                            type="number"
                            min="1"
                            step="0.01"
                            placeholder={q.price?.toString() ?? "0.00"}
                            value={priceInputs[q.id] ?? ""}
                            onChange={(e) => setPriceInputs({ ...priceInputs, [q.id]: e.target.value })}
                            className="w-28 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                          />
                          <button
                            onClick={() => generatePaymentLink(q.id)}
                            disabled={actionLoading === q.id + "_quote"}
                            className="bg-brand-gold text-brand-brown-dark font-bold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold-light transition-colors disabled:opacity-50"
                          >
                            {actionLoading === q.id + "_quote" ? "Generating..." : "Generate Payment Link"}
                          </button>
                        </div>

                        {/* Show copyable link — built from state OR from saved token */}
                        {(paymentLinks[q.id] || q.paymentToken) && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-2 font-semibold">
                              ✅ Payment link ready — copy and text/email this to your customer:
                            </p>
                            <div className="flex gap-2 items-center">
                              <code className="text-xs bg-white border rounded px-2 py-1 flex-1 truncate text-gray-700">
                                {paymentLinks[q.id] ?? `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${q.paymentToken}`}
                              </code>
                              <button
                                onClick={() => {
                                  const url = paymentLinks[q.id] ?? `${window.location.origin}/pay/${q.paymentToken}`;
                                  copyLink(q.id, url);
                                }}
                                className="bg-brand-brown text-white text-xs font-bold px-3 py-1 rounded-lg hover:bg-brand-brown-dark transition-colors flex-shrink-0"
                              >
                                {copied === q.id ? "Copied! ✓" : "Copy"}
                              </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Only people with this exact link can access the payment page.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Charge balance */}
                    {q.depositPaid && !q.balancePaid && (
                      <button
                        onClick={() => chargeBalance(q.id)}
                        disabled={actionLoading === q.id + "_balance"}
                        className="bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === q.id + "_balance" ? "Processing..." : `Collect Balance ($${q.balanceAmount?.toFixed(2)})`}
                      </button>
                    )}

                    {/* Status controls */}
                    {q.status === "deposit_paid" && (
                      <button
                        onClick={() => updateStatus(q.id, "in_progress")}
                        className="bg-purple-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                      >
                        Mark In Progress
                      </button>
                    )}
                    {q.status !== "cancelled" && q.status !== "completed" && (
                      <button
                        onClick={() => updateStatus(q.id, "cancelled")}
                        className="bg-red-100 text-red-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <span className="font-semibold text-gray-500">{label}: </span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
