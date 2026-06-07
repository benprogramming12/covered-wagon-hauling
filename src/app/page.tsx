import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: "🏭",
    title: "Business-to-Business",
    desc: "Commercial deliveries between suppliers, warehouses, and storefronts. Your reliable last-mile partner.",
  },
  {
    icon: "🪵",
    title: "Skid & Freight Hauling",
    desc: "Standard skids and freight up to 1 ton. Same-day pickup and delivery available on most runs.",
  },
  {
    icon: "⚡",
    title: "After-Hours Same-Day",
    desc: "Available daily from 2:30 PM through late evening — when other carriers have already called it a day.",
  },
];

const whyUs = [
  { stat: "1 Ton", label: "Max Cargo Capacity" },
  { stat: "Same Day", label: "Delivery Available" },
  { stat: "2:30 PM+", label: "Daily Until Late Evening" },
  { stat: "B2B", label: "Commercial Focus" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-brand-brown overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-brown-dark via-brand-brown to-brand-green-dark opacity-90" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-brand-gold leading-tight mb-4">
              Hauling You Can<br />Count On
            </h1>
            <p className="text-brand-gold-pale text-lg md:text-xl mb-8 max-w-lg">
              Same-day commercial delivery, skid hauling up to 1 ton, and after-hours runs — available Monday through Friday from 2:30 PM to late evening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/quote" className="bg-brand-gold text-brand-brown-dark font-bold text-lg px-8 py-4 rounded-xl hover:bg-brand-gold-light transition-colors shadow-lg">
                Get a Free Quote
              </Link>
              <Link href="/services" className="border-2 border-brand-gold text-brand-gold font-bold text-lg px-8 py-4 rounded-xl hover:bg-brand-gold hover:text-brand-brown-dark transition-colors">
                Our Services
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Covered Wagon Hauling LLC"
              width={320}
              height={320}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-green py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {whyUs.map((item) => (
            <div key={item.label}>
              <div className="text-brand-gold font-display font-bold text-2xl md:text-3xl">{item.stat}</div>
              <div className="text-brand-gold-pale text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-brown text-center mb-4">
          What We Do
        </h2>
        <p className="text-center text-brand-brown/60 mb-12 max-w-xl mx-auto">
          Focused on commercial clients who need freight moved fast — without the red tape of big carriers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl shadow-md p-8 border border-brand-gold/20 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">{s.icon}</div>
              <h3 className="font-display font-bold text-xl text-brand-brown mb-3">{s.title}</h3>
              <p className="text-brand-brown/70">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/services" className="text-brand-gold font-bold hover:underline text-lg">
            See all services →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-brand-green-dark py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-gold text-center mb-3">
            How It Works
          </h2>
          <p className="text-brand-gold-pale/70 text-center mb-12 max-w-lg mx-auto">
            Simple, straightforward process from request to delivery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Submit a Quote", desc: "Fill out our quick form with your pickup, drop-off, cargo details, and preferred date and time." },
              { step: "2", title: "We Confirm & Price", desc: "We review your request and send you a quote — usually within the hour. Pay a 50% deposit to lock in your booking, or choose to pay in full on delivery (COD)." },
              { step: "3", title: "We Deliver & Collect", desc: "We pick up and deliver your freight curbside. Remaining balance is collected on delivery by card or cash — no surprises." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-brand-gold text-brand-brown-dark font-display font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-xl text-brand-gold mb-2">{item.title}</h3>
                <p className="text-brand-gold-pale/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Credentials */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-brand-brown text-center mb-10">
          Licensed, Insured &amp; DOT Certified
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🛡️", title: "Fully Insured", desc: "Cargo and liability insurance on every run." },
            { icon: "📋", title: "USDOT #5332573", desc: "Registered and certified with the US Dept. of Transportation." },
            { icon: "🚛", title: "MC #834147", desc: "Licensed motor carrier authorized for commercial freight." },
            { icon: "✅", title: "Professional & Reliable", desc: "We show up on time and handle your freight with care." },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-brand-gold/20 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-brand-brown mb-2">{item.title}</h3>
              <p className="text-brand-brown/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-brand-brown/40 text-xs mt-6">
          DOT and MC numbers available upon request.
        </p>
      </section>

      {/* CTA banner */}
      <section className="bg-brand-brown mx-4 md:mx-auto md:max-w-6xl rounded-3xl mb-16 px-8 py-14 text-center shadow-xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-gold mb-4">
          Need a Same-Day Run?
        </h2>
        <p className="text-brand-gold-pale text-lg mb-8 max-w-xl mx-auto">
          Fill out a quick quote form — we&apos;re available Mon–Fri from 2:30 PM to late evening, and weekends by request.
        </p>
        <Link href="/quote" className="bg-brand-gold text-brand-brown-dark font-bold text-xl px-10 py-4 rounded-xl hover:bg-brand-gold-light transition-colors inline-block shadow-lg">
          Request a Quote Now
        </Link>
      </section>

      <Footer />
    </div>
  );
}
