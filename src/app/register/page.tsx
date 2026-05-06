"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
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
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Daftar</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-emerald-700 underline dark:text-emerald-400">
          Masuk
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : "Buat akun"}
        </Button>
      </form>
    </div>
  );
}
