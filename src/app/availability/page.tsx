import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

export const metadata = {
  title: "Availability — Covered Wagon Hauling LLC",
  description: "Check available dates and plan your delivery with Covered Wagon Hauling LLC.",
};

export default function AvailabilityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-brand-brown py-14 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-gold mb-3">
          Availability
        </h1>
        <p className="text-brand-gold-pale max-w-xl mx-auto">
          Browse open dates and plan your job. Available Mon–Fri from 2:30 PM, weekends by request.
        </p>
      </section>

      <div className="max-w-4xl mx-auto w-full px-4 py-12">
        <AvailabilityCalendar />
      </div>

      <Footer />
    </div>
  );
}
