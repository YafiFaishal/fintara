"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { formatIDR } from "@/lib/money";
import { getMonthYear } from "@/lib/month";
import { WishlistItemCard, type ItemWithLogs } from "./wishlist-item-card";
import { evaluateBalanceAlerts } from "@/lib/balance-alerts";

type ApiWishlist = {
  items: ItemWithLogs[];
  cleanBalance: number;
  budgetId: string | null;
  monthYear: string;
};

/**
 * Form tambah wishlist + daftar item dengan alert yang dihitung ulang di server.
 */
export function WishlistClient({ initialMonth }: { initialMonth: string }) {
  const [monthYear, setMonthYear] = useState(initialMonth);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [data, setData] = useState<ApiWishlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inlinePreview, setInlinePreview] = useState<{
    warnings: string[];
    cautions: string[];
    remaining: number;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/wishlist?month=${encodeURIComponent(monthYear)}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Gagal memuat");
      setData(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [monthYear]);

  useEffect(() => {
    void load();
  }, [load]);

  const priceNum = parseInt(price.replace(/\D/g, ""), 10) || 0;

  // Pratinjau alert di klien (selaras dengan server; server tetap sumber kebenaran saat simpan)
  useEffect(() => {
    if (!data || priceNum <= 0) {
      setInlinePreview(null);
      return;
    }
    const { warnings, cautions, remaining } = evaluateBalanceAlerts(data.cleanBalance, priceNum);
    setInlinePreview({ warnings, cautions, remaining });
  }, [data, priceNum]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          price: priceNum,
          monthYear,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Gagal menambah");
      setName("");
      setPrice("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-4">
        <label className="block">
          <span className="text-sm font-medium text-[#1a1a2e] dark:text-white">Bulan wishlist</span>
          <input
            type="month"
            className="glass-input mt-1 w-full px-3 py-2"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
          />
        </label>
        <p className="mt-1 text-xs text-slate-600 dark:text-white/60">Harus sama dengan bulan budget. Hari ini: {getMonthYear()}</p>
      </div>

      {data ? (
        <div className="glass-alert-safe p-4">
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">Saldo aman (referensi)</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-emerald-800 dark:text-emerald-100">
            ✓ {formatIDR(data.cleanBalance)}
          </p>
          {!data.budgetId ? (
            <p className="glass-alert-danger mt-2 px-3 py-2 text-sm text-rose-800 dark:text-rose-100">
              ⚠{" "}
              Belum ada budget untuk bulan ini — atur di menu Budget dulu.
            </p>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={addItem} className="glass-card space-y-4 p-4">
        <h2 className="font-semibold text-[#1a1a2e] dark:text-white">Barang incaran</h2>
        <InputField label="Nama barang" value={name} onChange={(e) => setName(e.target.value)} required />
        <InputField
          label="Harga (Rp)"
          type="text"
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Contoh: 250000"
          required
        />

        {inlinePreview && (inlinePreview.warnings.length > 0 || inlinePreview.cautions.length > 0) ? (
          <div className="space-y-2">
            {inlinePreview.warnings.map((t, i) => (
              <div
                key={`w-${i}`}
                className="glass-alert-danger px-3 py-2 text-sm text-rose-900 dark:text-rose-50"
              >
                <strong>⚠ Peringatan: </strong>
                {t}
              </div>
            ))}
            {inlinePreview.cautions.map((t, i) => (
              <div
                key={`c-${i}`}
                className="glass-alert-caution px-3 py-2 text-sm text-amber-950 dark:text-amber-100"
              >
                <strong>⚠ Hati-hati: </strong>
                {t}
              </div>
            ))}
            <p className="text-xs text-slate-600 dark:text-white/60">
              Estimasi sisa saldo aman setelah beli:{" "}
              <strong className="text-[#1a1a2e] dark:text-white">{formatIDR(inlinePreview.remaining)}</strong>
            </p>
          </div>
        ) : null}

        {error ? <p className="glass-alert-danger px-3 py-2 text-sm text-rose-800 dark:text-rose-100">⚠ {error}</p> : null}

        <Button type="submit" variant="primary" className="w-full" disabled={loading || !data?.budgetId}>
          {loading ? "Menyimpan…" : "Tambah ke wishlist"}
        </Button>
      </form>

      <section>
        <h2 className="mb-3 font-semibold text-[#1a1a2e] dark:text-white">Daftar kamu</h2>
        {loading && !data ? <p className="text-sm text-slate-600 dark:text-white/60">Memuat…</p> : null}
        {data?.items.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-white/60">Belum ada barang. Tambahkan yang kamu pikirkan beli nanti.</p>
        ) : null}
        <div className="space-y-4">
          {data?.items.map((item) => (
            <WishlistItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
