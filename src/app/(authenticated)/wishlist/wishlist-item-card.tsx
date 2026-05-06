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
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{item.name}</h3>
          <p className="text-lg font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
            {formatIDR(item.price)}
          </p>
          <p className="text-xs text-zinc-500">
            Aturan timer: {coolingOffLabel(item.price)} · berakhir{" "}
            {endDate.toLocaleString("id-ID")}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isClosed
              ? item.status === "BOUGHT"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-zinc-100 text-zinc-600"
              : canDecide
                ? "bg-amber-100 text-amber-900"
                : "bg-sky-100 text-sky-900"
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
              className={`rounded-lg px-3 py-2 text-sm ${
                a.alertType === "WARNING"
                  ? "border border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-100"
                  : "border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
              }`}
            >
              <strong className="mr-1">{a.alertType === "WARNING" ? "Peringatan:" : "Hati-hati:"}</strong>
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

      {err ? <p className="mt-2 text-sm text-rose-600">{err}</p> : null}

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
