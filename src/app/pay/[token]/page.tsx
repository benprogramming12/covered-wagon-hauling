import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import PayButton from "./PayButton";

export default async function PayPage({ params }: { params: { token: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { paymentToken: params.token },
  });

  if (!quote || !quote.price) notFound();

  // Already fully paid
  if (quote.balancePaid) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-brand-gold/20">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="font-display text-2xl font-bold text-brand-brown mb-2">All Paid Up!</h1>
          <p className="text-brand-brown/60">This job has been fully paid. Thank you for choosing Covered Wagon Hauling LLC!</p>
        </div>
      </div>
    );
  }

  // Deposit already paid — show balance info
  if (quote.depositPaid) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-brand-gold/20">
          <Image src="/logo.png" alt="Logo" width={80} height={80} className="mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-brand-brown mb-2">Deposit Received ✓</h1>
          <p className="text-brand-brown/70 mb-4">
            Your 50% deposit of <strong>${quote.depositAmount?.toFixed(2)}</strong> has been paid.
          </p>
          <div className="bg-brand-gold-pale rounded-xl p-4 text-brand-brown text-sm mb-6">
            <p><strong>Remaining balance:</strong> ${quote.balanceAmount?.toFixed(2)}</p>
            <p className="text-brand-brown/60 mt-1">Collected on delivery.</p>
          </div>
          <p className="text-brand-brown/50 text-sm">Questions? Call us at <a href="tel:+12482591036" className="text-brand-gold font-bold">248.259.1036</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full border border-brand-gold/20">
        {/* Header */}
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Covered Wagon Hauling LLC" width={80} height={80} className="mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold text-brand-brown">Confirm Your Booking</h1>
          <p className="text-brand-brown/60 text-sm mt-1">Covered Wagon Hauling LLC</p>
        </div>

        {/* Job summary */}
        <div className="bg-brand-cream rounded-xl p-5 mb-6 space-y-2 text-sm border border-brand-gold/20">
          <h2 className="font-bold text-brand-brown mb-3">Your Job Details</h2>
          <Row label="Name" value={quote.name} />
          <Row label="Date" value={quote.scheduledDate} />
          <Row label="Time" value={quote.scheduledTime} />
          <Row label="Pickup" value={quote.pickupAddress} />
          <Row label="Drop-off" value={quote.dropoffAddress} />
          <Row label="Cargo" value={quote.cargoDescription} />
        </div>

        {/* Price breakdown */}
        <div className="border border-brand-gold/30 rounded-xl p-5 mb-6">
          <div className="flex justify-between text-brand-brown mb-2">
            <span>Total job price</span>
            <span className="font-bold">${quote.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-brand-brown/60 text-sm mb-2">
            <span>Balance due on delivery</span>
            <span>${quote.balanceAmount?.toFixed(2)}</span>
          </div>
          <div className="border-t border-brand-gold/20 pt-3 mt-3 flex justify-between font-bold text-brand-brown text-lg">
            <span>50% Deposit Due Now</span>
            <span className="text-brand-gold">${quote.depositAmount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Pay button */}
        <PayButton quoteId={quote.id} depositAmount={quote.depositAmount!} />

        <p className="text-center text-xs text-brand-brown/40 mt-4">
          Payments secured by Stripe. Your card details are never stored by us.<br />
          Questions? Call <a href="tel:+12482591036" className="text-brand-gold">248.259.1036</a>
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-brand-brown/50 w-20 flex-shrink-0">{label}:</span>
      <span className="text-brand-brown font-medium">{value}</span>
    </div>
  );
}
