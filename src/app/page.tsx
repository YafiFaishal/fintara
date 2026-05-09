import Link from "next/link";
import { auth } from "@/auth";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Button } from "@/components/ui/button";

/**
 * Halaman awal — menjelaskan FINTARA dan mengarahkan ke daftar/masuk.
 */
export default async function HomePage() {
  const session = await auth();

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="mx-auto flex min-h-full max-w-lg flex-col px-4 py-12">
        <div className="glass-card mx-auto p-6">
          <BrandLogo size="lg" className="mx-auto" />
        </div>
        <p className="mt-6 text-center text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
          Financial Tracker & Awareness
        </p>
        <h1 className="mt-2 text-center text-4xl font-black tracking-tight text-[#1a1a2e] dark:text-white">
          FINTARA
        </h1>
        <p className="mt-4 text-center text-lg leading-relaxed text-slate-700 dark:text-white/70">
          Bantu kamu menahan <span className="font-semibold text-[#1a1a2e] dark:text-white">impulsive buying</span>{" "}
          dengan budget bulanan jujur dan timer cooling-off yang tersimpan di server — tetap jalan walau browser
          ditutup.
        </p>

        <ul className="mt-8 space-y-3 text-sm text-slate-700 dark:text-white/70">
          <li className="flex gap-2">
            <span className="font-bold text-cyan-600">1.</span>
            Atur pemasukan dan kebutuhan pokok → dapat saldo aman.
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-cyan-600">2.</span>
            Tambah barang incaran → timer otomatis sesuai harga.
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-cyan-600">3.</span>
            Dapat peringatan kalau saldo tidak cukup atau terlalu sempit.
          </li>
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {session?.user ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button type="button" variant="primary" className="w-full">
                Ke beranda app
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/splash" className="w-full sm:w-auto">
                <Button type="button" variant="secondary" className="w-full">
                  Lihat splash
                </Button>
              </Link>
              <Link href="/onboarding" className="w-full sm:w-auto">
                <Button type="button" variant="secondary" className="w-full">
                  Lihat onboarding
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button type="button" variant="primary" className="w-full">
                  Mulai gratis
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button type="button" variant="secondary" className="w-full">
                  Masuk
                </Button>
              </Link>
            </>
          )}
        </div>

        <p className="mt-12 text-center text-xs text-slate-600 dark:text-white/60">
          Input manual — tanpa sambungan bank atau e-commerce.
        </p>
      </div>
    </div>
  );
}
