"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatIDR } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { CoolingCountdown } from "@/components/cooling-countdown";
import { coolingOffLabel } from "@/lib/cooling-off";

/** Bentuk data dari API (tanggal diserialisasi sebagai string). */
export type ItemWithLogs = {
  id: string;
  name: string;
  price: number;
  coolingOffEndsAt: string;
  status: "PENDING_COOLING" | "READY" | "BOUGHT" | "SKIPPED";
  alertLogs: { id: string; alertType: "WARNING" | "CAUTION"; message: string }[];
};

type Props = {
  item: ItemWithLogs;
};

/**
 * Kartu satu barang: alert inline, hitung mundur cooling-off, aksi beli/lewati.
 */
export function WishlistItemCard({ item }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const endDate = new Date(item.coolingOffEndsAt);
  const now = new Date();
  const coolingDone = endDate <= now;
  const canDecide =
    item.status === "READY" ||
    (item.status === "PENDING_COOLING" && coolingDone);

  const isClosed = item.status === "BOUGHT" || item.status === "SKIPPED";

  async function decide(action: "bought" | "skip") {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/wishlist/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="glass-card p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white">{item.name}</h3>
          <p className="text-lg font-bold tabular-nums text-slate-800 dark:text-white">
            {formatIDR(item.price)}
          </p>
          <p className="text-xs text-slate-600 dark:text-white/60">
            Aturan timer: {coolingOffLabel(item.price)} · berakhir{" "}
            {endDate.toLocaleString("id-ID")}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isClosed
              ? item.status === "BOUGHT"
                ? "glass-alert-safe text-emerald-800 dark:text-emerald-100"
                : "bg-white/55 text-slate-700 ring-1 ring-slate-900/10 dark:bg-white/10 dark:text-white/70 dark:ring-white/10"
              : canDecide
                ? "glass-alert-caution text-amber-900 dark:text-amber-100"
                : "bg-cyan-100/70 text-cyan-900 ring-1 ring-cyan-500/20 dark:bg-cyan-400/15 dark:text-cyan-100 dark:ring-cyan-300/20"
          }`}
        >
          {item.status === "PENDING_COOLING" && !coolingDone && "Cooling-off"}
          {item.status === "PENDING_COOLING" && coolingDone && "Siap putuskan"}
          {item.status === "READY" && "Siap putuskan"}
          {item.status === "BOUGHT" && "Dibeli"}
          {item.status === "SKIPPED" && "Dilewati"}
        </span>
      </div>

      {item.alertLogs.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {item.alertLogs.map((a) => (
            <li
              key={a.id}
              className={`px-3 py-2 text-sm ${
                a.alertType === "WARNING"
                  ? "glass-alert-danger text-rose-900 dark:text-rose-100"
                  : "glass-alert-caution text-amber-900 dark:text-amber-100"
              }`}
            >
              <strong className="mr-1">{a.alertType === "WARNING" ? "⚠ Peringatan:" : "⚠ Hati-hati:"}</strong>
              {a.message}
            </li>
          ))}
        </ul>
      ) : null}

      {!isClosed && !canDecide ? (
        <div className="mt-3 text-sm">
          <CoolingCountdown
            endsAt={Number.isNaN(endDate.getTime()) ? item.coolingOffEndsAt : endDate.toISOString()}
            onDone={() => router.refresh()}
          />
        </div>
      ) : null}

      {err ? <p className="glass-alert-danger mt-2 px-3 py-2 text-sm text-rose-800 dark:text-rose-100">⚠ {err}</p> : null}

      {!isClosed && canDecide ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="primary" disabled={busy} onClick={() => decide("bought")}>
            Tandai dibeli
          </Button>
          <Button type="button" variant="secondary" disabled={busy} onClick={() => decide("skip")}>
            Lewati (tidak jadi)
          </Button>
        </div>
      ) : null}
    </article>
  );
}
