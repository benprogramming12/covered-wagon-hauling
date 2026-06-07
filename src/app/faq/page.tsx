"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const faqs = [
  {
    q: "What areas do you service?",
    a: "We primarily serve the Metro Detroit area and surrounding Southeast Michigan counties. Not sure if we cover your area? Give us a call at 248.259.1036 and we'll let you know.",
  },
  {
    q: "How much can you haul?",
    a: "Our cargo van can handle up to 1 ton (2,000 lbs) including standard-sized skids and palletized freight. If your load fits in a cargo van, we can move it.",
  },
  {
    q: "Do you go inside homes or businesses to pick up or deliver?",
    a: "We provide curbside and threshold delivery only. We'll offload at your garage, driveway, loading dock, storage unit, or office entrance — but we do not enter private residences. This keeps our insurance clean and your liability covered.",
  },
  {
    q: "What are your hours?",
    a: "We're available Monday through Friday from 2:30 PM to late evening. Weekends are available by request — just reach out and we'll do our best to accommodate you.",
  },
  {
    q: "How do I get a quote?",
    a: "Fill out our online quote form with your pickup address, drop-off address, cargo details, and preferred date and time. We'll review it and get back to you — usually within the hour.",
  },
  {
    q: "How does payment work?",
    a: "We offer two options: a 50% deposit upfront to lock in your booking with the balance due on delivery, or Cash on Delivery (COD) where you pay the full amount when your freight arrives. We accept all major credit cards and cash.",
  },
  {
    q: "Can you do same-day delivery?",
    a: "Yes — same-day delivery is one of our specialties. Submit your quote request as early as possible and we'll confirm availability. We can often pick up within a couple of hours of booking.",
  },
  {
    q: "Do you haul for individuals or just businesses?",
    a: "Our focus is business-to-business commercial freight, but we do take on individual jobs for things like large item delivery to a garage or storage unit. We just don't go inside homes.",
  },
  {
    q: "Are you insured?",
    a: "Yes. We carry cargo and liability insurance on every run. We are also a licensed motor carrier (USDOT #5332573, MC #834147) operating in full compliance with federal regulations.",
  },
  {
    q: "Can I set up a regular delivery route or recurring account?",
    a: "Absolutely. If you need regular scheduled runs — daily, weekly, or on-demand — we'd love to work out a commercial account arrangement. Call us at 248.259.1036 to discuss.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-brand-brown py-16 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-gold mb-4">Frequently Asked Questions</h1>
        <p className="text-brand-gold-pale max-w-xl mx-auto">
          Everything you need to know about Covered Wagon Hauling LLC.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 w-full">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-brand-gold/10 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-brand-cream transition-colors"
              >
                <span className="font-semibold text-brand-brown pr-4">{faq.q}</span>
                <span className="text-brand-gold text-xl flex-shrink-0">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-brand-brown/70 border-t border-brand-gold/10 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-brand-brown rounded-2xl p-8 text-center">
          <h2 className="font-display font-bold text-2xl text-brand-gold mb-3">Still have questions?</h2>
          <p className="text-brand-gold-pale mb-6">Call us directly — we&apos;re happy to talk through your job before you commit to anything.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+12482591036" className="bg-brand-gold text-brand-brown-dark font-bold px-8 py-3 rounded-xl hover:bg-brand-gold-light transition-colors">
              📞 248.259.1036
            </a>
            <Link href="/quote" className="border-2 border-brand-gold text-brand-gold font-bold px-8 py-3 rounded-xl hover:bg-brand-gold hover:text-brand-brown-dark transition-colors">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
