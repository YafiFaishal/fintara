/**
 * Aturan cooling-off berdasarkan harga (Rupiah):
 * - di bawah 50.000  → 10 menit
 * - 50.000–300.000 → 24 jam
 * - di atas 300.000 → 30 hari
 */
export function getCoolingOffDurationMs(priceIdr: number): number {
  if (priceIdr < 50_000) return 10 * 60 * 1000;
  if (priceIdr <= 300_000) return 24 * 60 * 60 * 1000;
  return 30 * 24 * 60 * 60 * 1000;
}

export function getCoolingOffEndsAt(createdAt: Date, priceIdr: number): Date {
  return new Date(createdAt.getTime() + getCoolingOffDurationMs(priceIdr));
}

export function coolingOffLabel(priceIdr: number): string {
  if (priceIdr < 50_000) return "10 menit";
  if (priceIdr <= 300_000) return "24 jam";
  return "30 hari";
}
