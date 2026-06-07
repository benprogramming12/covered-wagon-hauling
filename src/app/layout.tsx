import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Covered Wagon Hauling LLC | Cargo Van Delivery Metro Detroit",
    template: "%s | Covered Wagon Hauling LLC",
  },
  description: "Same-day cargo van delivery in Metro Detroit and Southeast Michigan. Skid hauling up to 1 ton, business-to-business freight, and after-hours runs. USDOT #5332573.",
  keywords: [
    "cargo van delivery Detroit",
    "same day delivery Metro Detroit",
    "freight hauling Southeast Michigan",
    "skid delivery Michigan",
    "last mile delivery Detroit",
    "after hours delivery Michigan",
    "B2B delivery Detroit",
    "cargo hauling Oakland County",
    "Covered Wagon Hauling",
  ],
  openGraph: {
    title: "Covered Wagon Hauling LLC | Cargo Van Delivery Metro Detroit",
    description: "Same-day cargo van delivery, skid hauling up to 1 ton, and after-hours runs in Metro Detroit. Available Mon–Fri 2:30 PM to late evening.",
    type: "website",
    locale: "en_US",
  },
  metadataBase: new URL("https://www.coveredwagonhauling.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
