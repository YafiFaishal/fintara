import { getMonthYear } from "@/lib/month";
import { BudgetClient } from "./budget-client";

export default function BudgetPage() {
  const initialMonth = getMonthYear();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Budget bulanan</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Masukkan pemasukan dan kebutuhan wajib. Sistem menghitung saldo aman untuk wishlist & peringatan.
        </p>
      </div>
      <BudgetClient initialMonth={initialMonth} />
    </div>
  );
}
