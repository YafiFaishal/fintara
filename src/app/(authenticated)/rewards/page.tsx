const badges = [
  { name: "No Impulse 7 Hari", earned: true },
  { name: "Budget Master", earned: true },
  { name: "Wishlist Guardian", earned: false },
  { name: "Saving Hero", earned: false },
] as const;

export default function RewardsPage() {
  return (
    <div className="space-y-4">
      <section className="glass-card cyan-glow p-5">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Gamification Rewards</h1>
        <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
          Tetap konsisten, kumpulkan badge, dan jaga streak biar finansial kamu naik level.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/55 p-3 ring-1 ring-white/50 dark:bg-white/10 dark:ring-white/10">
            <p className="text-xs text-slate-600 dark:text-white/60">Streak</p>
            <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">12 hari</p>
          </div>
          <div className="rounded-2xl bg-white/55 p-3 ring-1 ring-white/50 dark:bg-white/10 dark:ring-white/10">
            <p className="text-xs text-slate-600 dark:text-white/60">XP</p>
            <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">2.430</p>
          </div>
          <div className="rounded-2xl bg-white/55 p-3 ring-1 ring-white/50 dark:bg-white/10 dark:ring-white/10">
            <p className="text-xs text-slate-600 dark:text-white/60">Level</p>
            <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">5</p>
          </div>
        </div>
      </section>

      <section className="glass-card p-4">
        <h2 className="font-semibold text-[#1a1a2e] dark:text-white">Achievement badges</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <article
              key={badge.name}
              className={`rounded-2xl p-3 ring-1 ${
                badge.earned
                  ? "bg-cyan-100/70 text-cyan-950 ring-cyan-500/20 dark:bg-cyan-400/15 dark:text-cyan-100 dark:ring-cyan-300/20"
                  : "bg-white/50 text-slate-600 ring-slate-900/10 dark:bg-white/10 dark:text-white/60 dark:ring-white/10"
              }`}
            >
              <p className="text-sm font-semibold">{badge.name}</p>
              <p className="text-xs">{badge.earned ? "Unlocked" : "Belum terbuka"}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
