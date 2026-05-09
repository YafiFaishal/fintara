import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CoolingOffPage() {
  return (
    <div className="space-y-4">
      <section className="glass-card p-5">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Cooling-Off Purchase</h1>
        <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
          Sebelum kamu beli, FINTARA meminta jeda agar keputusanmu lebih sadar dan tidak impulsif.
        </p>
      </section>

      <section className="glass-card p-4">
        <h2 className="font-semibold text-[#1a1a2e] dark:text-white">Kenapa ini penting?</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-white/70">
          <li>Meredakan dorongan emosional saat ingin checkout cepat.</li>
          <li>Membantu mengecek apakah item benar-benar dibutuhkan.</li>
          <li>Mengurangi kebiasaan belanja FOMO.</li>
        </ul>
        <Link href="/wishlist" className="mt-4 block">
          <Button className="w-full">Buka wishlist timer</Button>
        </Link>
      </section>
    </div>
  );
}
