"use client";

import { useEffect, useState } from "react";

type Props = { endsAt: string; onDone?: () => void };

/**
 * Hitung mundur berbasis waktu server (`endsAt` ISO); sinkron saat tab aktif lagi.
 */
export function CoolingCountdown({ endsAt, onDone }: Props) {
  const end = new Date(endsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (now >= end && onDone) onDone();
  }, [now, end, onDone]);

  const remaining = Math.max(0, end - now);
  if (remaining === 0) {
    return <span className="font-medium text-emerald-700 dark:text-emerald-300">✓ Selesai — kamu bisa memutuskan</span>;
  }

  const s = Math.floor(remaining / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  let text = "";
  if (d > 0) text = `${d} hari ${h} jam ${m} menit`;
  else if (h > 0) text = `${h} jam ${m} menit ${sec} detik`;
  else if (m > 0) text = `${m} menit ${sec} detik`;
  else text = `${sec} detik`;

  return (
    <span className="tabular-nums text-slate-700 dark:text-white/70">
      Sisa waktu: <strong>{text}</strong>
    </span>
  );
}
