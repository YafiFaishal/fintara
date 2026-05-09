import Link from "next/link";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Track income & expense",
    text: "Catat pemasukan, pengeluaran, dan kebiasaan belanja agar kamu selalu sadar posisi keuangan.",
  },
  {
    title: "Cooling-off sebelum beli",
    text: "Sebelum checkout, FINTARA memaksa jeda waktu agar keputusanmu lebih rasional.",
  },
  {
    title: "Level up finansial kamu",
    text: "Selesaikan challenge harian, kumpulkan badge, dan jaga streak supaya disiplin makin kuat.",
  },
] as const;

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-8">
      <div className="glass-card p-6 text-center">
        <BrandLogo size="md" className="mx-auto" />
        <h1 className="mt-3 text-2xl font-bold text-[#1a1a2e] dark:text-white">Selamat datang di FINTARA</h1>
        <p className="mt-2 text-sm text-slate-700 dark:text-white/70">
          App finansial mobile-first untuk bantu kamu belanja lebih sadar dan menabung lebih konsisten.
        </p>
      </div>

      {steps.map((s, index) => (
        <section key={s.title} className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
            Step {index + 1}
          </p>
          <h2 className="mt-1 text-lg font-bold text-[#1a1a2e] dark:text-white">{s.title}</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">{s.text}</p>
        </section>
      ))}

      <div className="grid grid-cols-2 gap-2">
        <Link href="/login">
          <Button className="w-full" variant="secondary">
            Masuk
          </Button>
        </Link>
        <Link href="/register">
          <Button className="w-full">Mulai</Button>
        </Link>
      </div>
    </div>
  );
}
