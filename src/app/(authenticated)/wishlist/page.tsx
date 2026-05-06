import { getMonthYear } from "@/lib/month";
import { WishlistClient } from "./wishlist-client";

export default function WishlistPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Wishlist & cooling-off</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Timer disimpan di server — tutup browser pun, waktu tetap jalan. Setelah habis, pilih dibeli atau lewati.
        </p>
      </div>
      <WishlistClient initialMonth={getMonthYear()} />
    </div>
  );
}
