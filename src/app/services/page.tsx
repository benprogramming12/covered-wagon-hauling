import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services",
  description: "Cargo van delivery services in Metro Detroit — same-day, B2B freight, skid hauling up to 1 ton, and curbside delivery. Available 2:30 PM to late evening.",
};

const services = [
  {
    icon: "🏭",
    title: "Business-to-Business Delivery",
    desc: "We specialize in commercial deliveries between businesses. Whether you need supplies, equipment, or product runs between locations, we're your reliable last-mile partner.",
    bullets: [
      "Supplier to warehouse, warehouse to storefront",
      "Office supply and equipment runs",
      "Regular scheduled routes available",
    ],
  },
  {
    icon: "🪵",
    title: "Freight & Skid Hauling",
    desc: "Equipped to handle standard-sized skids and freight up to 1 ton. If it fits in a cargo van and doesn't require a full semi, we can move it — fast.",
    bullets: [
      "Standard skids and palletized freight",
      "Up to 1 ton (2,000 lbs) capacity",
      "Same-day pickup and delivery available",
    ],
  },
  {
    icon: "📦",
    title: "Curbside & Threshold Delivery",
    desc: "We deliver to your door — home, garage, office, or storage unit. We offload at the delivery point but do not enter homes or businesses. Perfect for oversized items that just need to get there.",
    bullets: [
      "Delivered to garage, driveway, or storage unit",
      "Office and loading dock drop-offs",
      "No inside-home delivery (curbside/threshold only)",
    ],
  },
  {
    icon: "⚡",
    title: "After-Hours & Same-Day",
    desc: "Available Monday through Friday from 2:30 PM to late evening, with weekends by request. When daytime carriers have already called it a day, we're just getting started.",
    bullets: [
      "Mon–Fri: 2:30 PM to late evening",
      "Saturday & Sunday: available by request",
      "Same-day delivery on most requests",
    ],
  },
];

const sizes = [
  { label: "Small", desc: "Boxes, packages, loose freight up to 200 lbs", icon: "📦" },
  { label: "Medium", desc: "Multi-box orders, equipment, 200–800 lbs", icon: "🔧" },
  { label: "Skid / Heavy", desc: "Standard pallets and skids up to 1 ton (2,000 lbs)", icon: "🪵" },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-brand-brown py-16 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-gold mb-4">Our Services</h1>
        <p className="text-brand-gold-pale text-lg max-w-xl mx-auto">
          Commercial cargo van delivery — built for businesses, available when you need it most.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        {services.map((s, i) => (
          <div key={s.title} className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center bg-white rounded-2xl shadow-md p-8 border border-brand-gold/10`}>
            <div className="text-7xl md:text-8xl flex-shrink-0">{s.icon}</div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-brown mb-3">{s.title}</h2>
              <p className="text-brand-brown/70 mb-4">{s.desc}</p>
              <ul className="space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-brand-brown/80">
                    <span className="text-brand-gold font-bold mt-0.5">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* What we can haul */}
      <section className="bg-brand-green-dark py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-brand-gold text-center mb-3">What We Can Haul</h2>
          <p className="text-brand-gold-pale/70 text-center mb-10 max-w-lg mx-auto">
            If it fits in a cargo van, we can move it. Up to a standard skid at 1 ton.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sizes.map((s) => (
              <div key={s.label} className="bg-brand-brown rounded-xl p-6 text-center">
                <div className="text-5xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-brand-gold text-xl mb-2">{s.label}</h3>
                <p className="text-brand-gold-pale/80 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-brand-brown py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-brand-gold text-center mb-8">Licensed, Insured &amp; Compliant</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: "🛡️", label: "Fully Insured", sub: "Cargo & liability" },
              { icon: "📋", label: "USDOT #5332573", sub: "US Dept. of Transportation" },
              { icon: "🚛", label: "MC #834147", sub: "Licensed Motor Carrier" },
              { icon: "✅", label: "Professional", sub: "On time, every time" },
            ].map((c) => (
              <div key={c.label} className="bg-brand-brown-dark rounded-xl p-4">
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-brand-gold font-bold text-sm">{c.label}</div>
                <div className="text-brand-gold-pale/60 text-xs mt-1">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment info */}
      <section className="max-w-3xl mx-auto px-4 pt-10">
        <div className="bg-white border border-brand-gold/20 rounded-2xl p-6 shadow-sm">
          <h3 className="font-display font-bold text-xl text-brand-brown mb-4">💳 Payment Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-brand-cream rounded-xl p-4">
              <div className="font-bold text-brand-brown mb-1">50% Deposit</div>
              <div className="text-brand-brown/60">Pay half upfront to lock in your booking. Balance collected on delivery. Most common for new customers.</div>
            </div>
            <div className="bg-brand-cream rounded-xl p-4">
              <div className="font-bold text-brand-brown mb-1">Cash on Delivery</div>
              <div className="text-brand-brown/60">Pay the full amount by card or cash when your freight arrives. Available on approved runs.</div>
            </div>
            <div className="bg-brand-cream rounded-xl p-4">
              <div className="font-bold text-brand-brown mb-1">Net 30 Invoicing</div>
              <div className="text-brand-brown/60">Available for established business accounts. Contact us to discuss a commercial account.</div>
            </div>
          </div>
          <p className="text-xs text-brand-brown/40 mt-4">We accept all major credit cards, debit cards, and cash.</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-brand-gold-pale border border-brand-gold/30 rounded-xl p-6 text-brand-brown text-sm">
          <strong className="block mb-1">📋 Delivery Policy</strong>
          We provide curbside and threshold delivery only. Our drivers will offload at your garage, driveway, loading dock, storage unit, or office entrance — but do not enter private residences. We are fully focused on getting your freight there safely and on time.
        </div>
      </section>

      <section className="text-center py-10 px-4">
        <h2 className="font-display text-3xl font-bold text-brand-brown mb-4">Ready to Book?</h2>
        <p className="text-brand-brown/70 mb-8 max-w-md mx-auto">Submit a quote request and we&apos;ll get back to you quickly with pricing.</p>
        <Link href="/quote" className="bg-brand-gold text-brand-brown-dark font-bold text-xl px-10 py-4 rounded-xl hover:bg-brand-gold-light transition-colors inline-block shadow-lg">
          Request a Quote
        </Link>
      </section>

      <Footer />
    </div>
  );
}
