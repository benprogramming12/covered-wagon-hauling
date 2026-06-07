import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md border border-brand-gold/20">
          <div className="text-7xl mb-4">✅</div>
          <h1 className="font-display text-3xl font-bold text-brand-brown mb-3">Deposit Received!</h1>
          <p className="text-brand-brown/70 mb-6">
            Your 50% deposit has been paid and your booking is confirmed. We&apos;ll see you on your scheduled date!
          </p>
          <p className="text-brand-brown/50 text-sm mb-8">
            The remaining balance will be collected after the job is completed.
          </p>
          <Link href="/" className="bg-brand-gold text-brand-brown-dark font-bold px-8 py-3 rounded-xl hover:bg-brand-gold-light transition-colors inline-block">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
