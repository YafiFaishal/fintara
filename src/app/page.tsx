import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

/**
 * Halaman awal — menjelaskan FINTARA dan mengarahkan ke daftar/masuk.
 */
export default async function HomePage() {
  const session = await auth();

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-zinc-50 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-black">
      <div className="mx-auto flex min-h-full max-w-lg flex-col px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          Financial Tracker & Awareness
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-900 dark:text-white">FINTARA</h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
          Bantu kamu menahan <span className="font-semibold text-zinc-800 dark:text-zinc-100">impulsive buying</span>{" "}
          dengan budget bulanan jujur dan timer cooling-off yang tersimpan di server — tetap jalan walau browser
          ditutup.
        </p>

        <ul className="mt-8 space-y-3 text-sm text-zinc-700 dark:text-zinc-400">
          <li className="flex gap-2">
            <span className="font-bold text-emerald-600">1.</span>
            Atur pemasukan dan kebutuhan pokok → dapat saldo aman.
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-emerald-600">2.</span>
            Tambah barang incaran → timer otomatis sesuai harga.
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-emerald-600">3.</span>
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

        <p className="mt-12 text-center text-xs text-zinc-500">
          Input manual — tanpa sambungan bank atau e-commerce.
        </p>
      </div>
    </div>
  );
}
