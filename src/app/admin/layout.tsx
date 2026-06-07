import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-brand-brown-dark shadow-lg px-6 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-brand-gold font-bold font-display">Admin Dashboard</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-brand-gold-pale text-sm hover:text-brand-gold">Quotes</Link>
          <Link href="/admin/availability" className="text-brand-gold-pale text-sm hover:text-brand-gold">Availability</Link>
          <Link href="/" className="text-brand-gold-pale text-sm hover:text-brand-gold">View Site</Link>
          <Link
            href="/api/auth/signout"
            className="bg-brand-gold/20 text-brand-gold-pale text-sm px-3 py-1 rounded-lg hover:bg-brand-gold/40 transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
