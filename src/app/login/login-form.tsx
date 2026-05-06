"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email atau password salah.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Masuk</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-emerald-700 underline dark:text-emerald-400">
          Daftar
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <InputField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : "Masuk"}
        </Button>
      </form>
    </>
  );
}
