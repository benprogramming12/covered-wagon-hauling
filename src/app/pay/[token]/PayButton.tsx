"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PayButton({
  quoteId,
  depositAmount,
}: {
  quoteId: string;
  depositAmount: number;
}) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch {
      toast.error("Something went wrong. Please call us at 248.259.1036");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full bg-brand-gold text-brand-brown-dark font-bold text-lg py-4 rounded-xl hover:bg-brand-gold-light transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Redirecting to payment..." : `Pay $${depositAmount.toFixed(2)} Deposit Now`}
    </button>
  );
}
