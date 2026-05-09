import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <section className="glass-card p-5">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Profile & Settings</h1>
        <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
          Atur preferensi pengalaman aplikasi termasuk mode gelap/terang.
        </p>
      </section>

      <section className="glass-card p-4">
        <h2 className="font-semibold text-[#1a1a2e] dark:text-white">Tampilan</h2>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/50 px-3 py-2 ring-1 ring-white/50 dark:bg-white/10 dark:ring-white/10">
          <span className="text-sm text-slate-700 dark:text-white/70">Tema aplikasi</span>
          <ThemeToggle />
        </div>
      </section>
    </div>
  );
}
