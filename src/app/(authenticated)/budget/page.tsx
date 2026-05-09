import { getMonthYear } from "@/lib/month";
import { BudgetClient } from "./budget-client";

export default function BudgetPage() {
  const initialMonth = getMonthYear();

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Budget bulanan</h1>
        <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
          Masukkan pemasukan dan kebutuhan wajib. Sistem menghitung saldo aman untuk wishlist & peringatan.
        </p>
      </div>
      <BudgetClient initialMonth={initialMonth} />
    </div>
  );
}
