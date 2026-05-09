const bars = [
  { label: "Minggu 1", value: 55 },
  { label: "Minggu 2", value: 72 },
  { label: "Minggu 3", value: 34 },
  { label: "Minggu 4", value: 61 },
] as const;

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <section className="glass-card p-5">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
          Insight pengeluaran kamu ditampilkan dalam format ringan, mobile, dan mudah dibaca.
        </p>
      </section>

      <section className="glass-card p-4">
        <h2 className="font-semibold text-[#1a1a2e] dark:text-white">Spending trend mingguan</h2>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {bars.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end rounded-xl bg-white/55 p-1 ring-1 ring-white/50 dark:bg-white/10 dark:ring-white/10">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-cyan-600 to-cyan-300"
                  style={{ height: `${b.value}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-white/60">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <article className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-white/60">Top kategori</p>
          <p className="mt-1 text-lg font-bold text-[#1a1a2e] dark:text-white">Makan & Nongkrong</p>
        </article>
        <article className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-white/60">Potensi hemat</p>
          <p className="mt-1 text-lg font-bold text-cyan-700 dark:text-cyan-300">Rp420.000 / bulan</p>
        </article>
      </section>
    </div>
  );
}
