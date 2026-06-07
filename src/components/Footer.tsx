import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-brown-dark text-brand-gold-pale mt-auto py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-brand-gold font-display font-bold text-lg mb-2">Covered Wagon Hauling LLC</h3>
          <p className="text-sm text-brand-gold-pale/70 mb-3">Commercial cargo van delivery — skids, freight, and same-day runs up to 1 ton.</p>
          <a href="tel:+12482591036" className="text-brand-gold font-bold text-lg hover:text-brand-gold-light transition-colors">📞 248.259.1036</a>
          <p className="text-xs text-brand-gold-pale/40 mt-2">USDOT #5332573 · MC #834147</p>
        </div>
        <div>
          <h4 className="font-bold mb-2 text-brand-gold">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
            <li><Link href="/services" className="hover:text-brand-gold transition-colors">Services</Link></li>
            <li><Link href="/quote" className="hover:text-brand-gold transition-colors">Get a Quote</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2 text-brand-gold">Availability</h4>
          <ul className="text-sm space-y-1 text-brand-gold-pale/80">
            <li>Mon–Fri: 2:30 PM – Late Evening</li>
            <li>Saturday: By Request</li>
            <li>Sunday: By Request</li>
            <li className="text-brand-gold-pale/50 text-xs pt-1">Curbside &amp; threshold delivery only.<br />We do not enter private residences.</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-brand-gold-pale/40 mt-8">
        © {new Date().getFullYear()} Covered Wagon Hauling LLC. All rights reserved.
      </div>
    </footer>
  );
}
