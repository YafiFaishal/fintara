import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BrandLogo } from "@/components/branding/brand-logo";
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
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-white/60">Bulan {monthYear}</p>
          <BrandLogo size="sm" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Halo 👋</h1>
        <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
          Kendalikan impulsive buying dengan cooling-off dan gambaran saldo jujur.
        </p>
      </div>

      <section className="glass-card p-5">
        <h2 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">Saldo aman (clean balance)</h2>
        <p className="mt-2 text-3xl font-bold tabular-nums text-cyan-900 dark:text-cyan-100">
          {cleanBalance === null ? "—" : formatIDR(cleanBalance)}
        </p>
        {!budget ? (
          <p className="mt-2 text-sm text-cyan-800/80 dark:text-cyan-200/80">
            Belum ada budget untuk bulan ini. Atur dulu pemasukan & kebutuhan pokok.
          </p>
        ) : (
          <p className="mt-2 text-sm text-cyan-800/80 dark:text-cyan-200/80">
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

      <section className="glass-card p-4">
        <h2 className="font-semibold text-[#1a1a2e] dark:text-white">Alur FINTARA</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-white/70">
          <li>Setup pemasukan & kebutuhan → dapatkan saldo aman.</li>
          <li>Tambahkan barang incaran → timer cooling-off jalan di server.</li>
          <li>Dapat peringatan jika saldo tidak cukup atau terlalu sempit.</li>
        </ol>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link href="/analytics">
          <Button className="w-full" variant="secondary">
            Spending analytics
          </Button>
        </Link>
        <Link href="/rewards">
          <Button className="w-full" variant="secondary">
            Rewards & streaks
          </Button>
        </Link>
      </section>
    </div>
  );
}
