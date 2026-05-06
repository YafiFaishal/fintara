import type { WishlistStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Sinkronisasi status: jika masa cooling-off sudah lewat, status PENDING_COOLING → READY.
 * Dipanggil di API dan halaman agar konsisten tanpa cron.
 */
export async function syncWishlistStatusesForUser(userId: string): Promise<void> {
  const now = new Date();
  await prisma.wishlistItem.updateMany({
    where: {
      userId,
      status: "PENDING_COOLING",
      coolingOffEndsAt: { lte: now },
    },
    data: { status: "READY" },
  });
}

/** Status efektif untuk tampilan (READY jika waktu sudah lewat meski DB belum sync). */
export function effectiveStatus(
  status: WishlistStatus,
  coolingOffEndsAt: Date,
): WishlistStatus {
  if (status !== "PENDING_COOLING") return status;
  if (new Date() >= new Date(coolingOffEndsAt)) return "READY";
  return "PENDING_COOLING";
}
