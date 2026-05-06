"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { formatIDR } from "@/lib/money";
import { getMonthYear } from "@/lib/month";

type Nec = { id?: string; name: string; amount: number };

/**
 * Form input budget bulanan + daftar kebutuhan (manual, tanpa API bank).
 */
export function BudgetClient({ initialMonth }: { initialMonth: string }) {
  const [monthYear, setMonthYear] = useState(initialMonth);
  const [totalIncome, setTotalIncome] = useState("");
  const [necessities, setNecessities] = useState<Nec[]>([
    { name: "", amount: 0 },
  ]);
  const [cleanBalance, setCleanBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/budgets?month=${encodeURIComponent(monthYear)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal memuat");
      if (data.budget) {
        setTotalIncome(String(data.budget.totalIncome));
        setNecessities(
          data.budget.necessities.length > 0
            ? data.budget.necessities.map((n: { name: string; amount: number }) => ({
                name: n.name,
                amount: n.amount,
              }))
            : [{ name: "", amount: 0 }],
        );
        setCleanBalance(data.cleanBalance);
      } else {
        setTotalIncome("");
        setNecessities([{ name: "", amount: 0 }]);
        setCleanBalance(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [monthYear]);

  useEffect(() => {
    void load();
  }, [load]);

  function addRow() {
    setNecessities((n) => [...n, { name: "", amount: 0 }]);
  }

  function updateRow(i: number, field: keyof Nec, value: string | number) {
    setNecessities((rows) => {
      const next = [...rows];
      const row = { ...next[i] };
      if (field === "amount") {
        row.amount = typeof value === "number" ? value : parseInt(String(value).replace(/\D/g, ""), 10) || 0;
      } else {
        row.name = String(value);
      }
      next[i] = row;
      return next;
    });
  }

  function removeRow(i: number) {
    setNecessities((rows) => rows.filter((_, j) => j !== i));
  }

  async function save() {
    setLoading(true);
    setMessage(null);
    setError(null);
    const incomeNum = parseInt(totalIncome.replace(/\D/g, ""), 10) || 0;
    const necPayload = necessities
      .filter((n) => n.name.trim().length > 0)
      .map((n) => ({ name: n.name.trim(), amount: Math.max(0, n.amount) }));

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthYear,
          totalIncome: incomeNum,
          necessities: necPayload,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Gagal simpan");
      setCleanBalance(data.cleanBalance);
      setMessage("Budget tersimpan.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Bulan (YYYY-MM)</span>
          <input
            type="month"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
          />
        </label>
        <p className="mt-1 text-xs text-zinc-500">Default mengikuti bulan ini: {getMonthYear()}</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <InputField
          label="Total pemasukan / saldo bulanan (Rp)"
          type="text"
          inputMode="numeric"
          placeholder="Contoh: 5000000"
          value={totalIncome}
          onChange={(e) => setTotalIncome(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Kebutuhan pokok</h2>
          <Button type="button" variant="secondary" className="text-xs" onClick={addRow}>
            + Baris
          </Button>
        </div>
        <div className="space-y-3">
          {necessities.map((row, i) => (
            <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <InputField
                  label="Nama"
                  value={row.name}
                  onChange={(e) => updateRow(i, "name", e.target.value)}
                  placeholder="Kos, makan, transport..."
                />
              </div>
              <div className="sm:w-40">
                <InputField
                  label="Jumlah (Rp)"
                  type="text"
                  inputMode="numeric"
                  value={row.amount ? String(row.amount) : ""}
                  onChange={(e) => updateRow(i, "amount", e.target.value)}
                />
              </div>
              {necessities.length > 1 ? (
                <Button type="button" variant="ghost" onClick={() => removeRow(i)}>
                  Hapus
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {cleanBalance !== null ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">Saldo aman (otomatis)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-800 dark:text-emerald-100">
            {formatIDR(cleanBalance)}
          </p>
          <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-300/80">
            Pemasukan dikurangi total kebutuhan pokok di atas.
          </p>
        </div>
      ) : null}

      {message ? (
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{message}</p>
      ) : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <Button type="button" variant="primary" className="w-full" disabled={loading} onClick={save}>
        {loading ? "Menyimpan…" : "Simpan budget"}
      </Button>
    </div>
  );
}
