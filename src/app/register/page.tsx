"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || undefined, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Gagal mendaftar");
        return;
      }
      const sign = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (sign?.error) {
        setError("Akun dibuat tetapi gagal masuk otomatis. Coba login manual.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12">
      <div className="glass-card mb-5 flex items-center justify-center py-5">
        <BrandLogo size="md" />
      </div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Buat akun FINTARA</h1>
      <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-cyan-700 underline dark:text-cyan-300">
          Masuk
        </Link>
      </p>

      <form onSubmit={onSubmit} className="glass-card mt-8 space-y-4 p-4">
        <InputField label="Nama (opsional)" value={name} onChange={(e) => setName(e.target.value)} />
        <InputField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Password (min. 6 karakter)"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="glass-alert-danger px-3 py-2 text-sm text-rose-800 dark:text-rose-100">⚠ {error}</p> : null}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : "Buat akun"}
        </Button>
      </form>
    </div>
  );
}
