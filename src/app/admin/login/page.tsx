"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.ok) {
      router.push("/admin");
    } else {
      setError("Invalid email or password.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-brand-brown-dark flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Logo" width={80} height={80} className="mx-auto mb-3" />
          <h1 className="font-display font-bold text-2xl text-brand-brown">Admin Login</h1>
          <p className="text-brand-brown/50 text-sm">Covered Wagon Hauling LLC</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-brown mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-brand-brown/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-brown mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-brand-brown/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-brand-brown-dark font-bold py-3 rounded-xl hover:bg-brand-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
