import { getMonthYear } from "@/lib/month";
import { WishlistClient } from "./wishlist-client";

export default function WishlistPage() {
  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Wishlist & cooling-off</h1>
        <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
          Timer disimpan di server — tutup browser pun, waktu tetap jalan. Setelah habis, pilih dibeli atau lewati.
        </p>
      </div>
      <WishlistClient initialMonth={getMonthYear()} />
    </div>
  );
}
