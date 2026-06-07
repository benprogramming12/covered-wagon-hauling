"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const PHONE = "248.259.1036";
const PHONE_HREF = "tel:+12482591036";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bg-brand-brown sticky top-0 z-50 shadow-lg">
        {/* Top bar */}
        <div className="bg-brand-brown-dark text-brand-gold-pale/70 text-xs text-center py-1 hidden sm:block">
          Licensed Motor Carrier · USDOT #5332573 · MC #834147 · Insured
        </div>

        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Covered Wagon Hauling LLC" width={48} height={48} className="rounded-full" />
            <span className="text-brand-gold font-display font-bold text-lg leading-tight hidden sm:block">
              Covered Wagon<br />
              <span className="text-brand-gold-pale text-sm font-normal">Hauling LLC</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-brand-gold-pale font-semibold">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <Link href="/services" className="hover:text-brand-gold transition-colors">Services</Link>
            <Link href="/availability" className="hover:text-brand-gold transition-colors">Availability</Link>
            <Link href="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link>
            <Link href="/about" className="hover:text-brand-gold transition-colors">About</Link>
            <a href={PHONE_HREF} className="flex items-center gap-2 text-brand-gold font-bold hover:text-brand-gold-light transition-colors">
              📞 {PHONE}
            </a>
            <Link href="/quote" className="bg-brand-gold text-brand-brown-dark px-4 py-2 rounded-lg hover:bg-brand-gold-light transition-colors font-bold">
              Get a Quote
            </Link>
          </div>

          {/* Mobile: phone + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <a href={PHONE_HREF} className="text-brand-gold font-bold text-sm">📞 {PHONE}</a>
            <button className="text-brand-gold-pale p-2" onClick={() => setOpen(!open)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-brand-brown-dark px-4 pb-4 flex flex-col gap-3 text-brand-gold-pale font-semibold">
            <Link href="/" onClick={() => setOpen(false)} className="hover:text-brand-gold pt-2">Home</Link>
            <Link href="/services" onClick={() => setOpen(false)} className="hover:text-brand-gold">Services</Link>
            <Link href="/availability" onClick={() => setOpen(false)} className="hover:text-brand-gold">Availability</Link>
            <Link href="/faq" onClick={() => setOpen(false)} className="hover:text-brand-gold">FAQ</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="hover:text-brand-gold">About</Link>
            <Link href="/quote" onClick={() => setOpen(false)} className="bg-brand-gold text-brand-brown-dark px-4 py-2 rounded-lg text-center font-bold">
              Get a Quote
            </Link>
          </div>
        )}
      </nav>

      {/* Sticky mobile call button */}
      <a
        href={PHONE_HREF}
        className="fixed bottom-5 right-5 z-50 md:hidden bg-brand-gold text-brand-brown-dark font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm"
      >
        📞 Call Now
      </a>
    </>
  );
}
