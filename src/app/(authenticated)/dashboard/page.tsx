import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeCleanBalance } from "@/lib/budget-math";
import { formatIDR } from "@/lib/money";
import { getMonthYear } from "@/lib/month";
import { Button } from "@/components/ui/button";

/**
 * Ringkasan cepat: saldo aman bulan ini + pintasan alur.
 */
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const monthYear = getMonthYear();

  const budget = await prisma.monthlyBudget.findUnique({
    where: {
      userId_monthYear: { userId: session.user.id, monthYear },
    },
    include: { necessities: true },
  });

  const cleanBalance = budget
    ? computeCleanBalance(
        budget.totalIncome,
        budget.necessities.map((n) => n.amount),
      )
    : null;

  const pendingWishlist = budget
    ? await prisma.wishlistItem.count({
        where: {
          budgetId: budget.id,
          status: { in: ["PENDING_COOLING", "READY"] },
        },
      })
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-zinc-500">Bulan {monthYear}</p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Halo 👋</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Kendalikan impulsive buying dengan cooling-off dan gambaran saldo jujur.
        </p>
      </div>

      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-zinc-900">
        <h2 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Saldo aman (clean balance)</h2>
        <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
          {cleanBalance === null ? "—" : formatIDR(cleanBalance)}
        </p>
        {!budget ? (
          <p className="mt-2 text-sm text-emerald-800/80 dark:text-emerald-200/80">
            Belum ada budget untuk bulan ini. Atur dulu pemasukan & kebutuhan pokok.
          </p>
        ) : (
          <p className="mt-2 text-sm text-emerald-800/80 dark:text-emerald-200/80">
            Setelah kebutuhan pokok dikurangi dari pemasukan bulanan.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/budget">
            <Button type="button" variant="primary" className="w-full sm:w-auto">
              {budget ? "Ubah budget" : "Atur budget bulanan"}
            </Button>
          </Link>
          <Link href="/wishlist">
            <Button type="button" variant="secondary" className="w-full sm:w-auto">
              Wishlist · {pendingWishlist} aktif
            </Button>
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Alur FINTARA</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Setup pemasukan & kebutuhan → dapatkan saldo aman.</li>
          <li>Tambahkan barang incaran → timer cooling-off jalan di server.</li>
          <li>Dapat peringatan jika saldo tidak cukup atau terlalu sempit.</li>
        </ol>
      </section>
    </div>
  );
}
