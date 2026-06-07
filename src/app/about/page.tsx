import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Owner-operated cargo van delivery in Metro Detroit. Licensed, insured, USDOT #5332573. Reliable B2B freight hauling available 2:30 PM to late evening.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-brand-brown py-16 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-gold mb-4">About Us</h1>
        <p className="text-brand-gold-pale max-w-xl mx-auto">
          A locally owned, owner-operated hauling service built on reliability and doing the job right.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-shrink-0">
            <Image src="/logo.png" alt="Covered Wagon Hauling LLC" width={240} height={240} className="drop-shadow-xl" />
          </div>
          <div className="space-y-4 text-brand-brown/80 text-lg leading-relaxed">
            <h2 className="font-display text-3xl font-bold text-brand-brown">Owner-Operated. Locally Focused.</h2>
            <p>
              Covered Wagon Hauling LLC was built around a simple idea: businesses deserve a freight option that&apos;s fast, reliable, and available when the big carriers aren&apos;t.
            </p>
            <p>
              We run every day from 2:30 PM to late evening — the hours when most delivery services have already shut down. Need a same-day skid moved across town before your warehouse closes? That&apos;s exactly what we&apos;re here for.
            </p>
            <p>
              As an owner-operated business, you&apos;re not dealing with a dispatcher or a call center. You&apos;re dealing with the person who will actually show up and haul your freight. That means accountability, communication, and care on every single run.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-green-dark py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-brand-gold text-center mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🤝", title: "Reliability", desc: "When we say we'll be there, we'll be there. Your freight and your schedule matter." },
              { icon: "📞", title: "Direct Communication", desc: "You talk to the owner, not a call center. Fast answers, real updates, no runaround." },
              { icon: "🔒", title: "Fully Compliant", desc: "Licensed, insured, and DOT certified. We operate by the book so you never have to worry." },
            ].map((v) => (
              <div key={v.title} className="bg-brand-brown rounded-xl p-6 text-center">
                <div className="text-5xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-brand-gold text-xl mb-2">{v.title}</h3>
                <p className="text-brand-gold-pale/70 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-brand-brown mb-8">Credentials</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "USDOT #5332573", icon: "📋" },
            { label: "MC #834147", icon: "🚛" },
            { label: "Fully Insured", icon: "🛡️" },
            { label: "Owner-Operated", icon: "👤" },
          ].map((c) => (
            <div key={c.label} className="bg-white border border-brand-gold/20 rounded-xl p-5 shadow-sm">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-bold text-brand-brown text-sm">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-brown mx-4 md:mx-auto md:max-w-4xl rounded-3xl mb-16 px-8 py-12 text-center shadow-xl">
        <h2 className="font-display text-3xl font-bold text-brand-gold mb-3">Ready to Work Together?</h2>
        <p className="text-brand-gold-pale mb-6">Get a quote or call us directly — we respond fast.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+12482591036" className="bg-white text-brand-brown font-bold px-8 py-3 rounded-xl hover:bg-brand-cream transition-colors">
            📞 248.259.1036
          </a>
          <Link href="/quote" className="bg-brand-gold text-brand-brown-dark font-bold px-8 py-3 rounded-xl hover:bg-brand-gold-light transition-colors">
            Request a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
