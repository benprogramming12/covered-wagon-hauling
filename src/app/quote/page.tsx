import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Get a free quote for same-day cargo van delivery in Metro Detroit. Skid hauling, B2B freight, after-hours runs. Fast response — usually within the hour.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";

export default function QuotePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="bg-brand-brown py-12 text-center">
        <h1 className="font-display text-4xl font-bold text-brand-gold mb-3">Request a Quote</h1>
        <p className="text-brand-gold-pale max-w-xl mx-auto">
          Fill out the form below. We&apos;ll review your request and send you a price — usually within the hour.
        </p>
      </section>
      <div className="max-w-3xl mx-auto w-full px-4 py-12">
        <QuoteForm />
      </div>
      <Footer />
    </div>
  );
}
