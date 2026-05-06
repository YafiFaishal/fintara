export type BalanceAlertResult = {
  /** Saldo bersih setelah membeli item ini */
  remaining: number;
  warnings: string[];
  cautions: string[];
};

const MSG_INSUFFICIENT =
  "Saldo kamu tidak akan cukup sampai akhir bulan jika membeli ini.";
const MSG_TIGHT =
  "Sisa saldo aman kamu akan sangat sempit (di bawah 20%) setelah pembelian ini.";

/**
 * Evaluasi alert saat menambah item wishlist.
 * - remaining &lt; 0 → peringatan keras
 * - sisa &lt; 20% dari saldo bersih awal → peringatan hati-hati
 */
export function evaluateBalanceAlerts(cleanBalance: number, itemPrice: number): BalanceAlertResult {
  const remaining = cleanBalance - itemPrice;
  const warnings: string[] = [];
  const cautions: string[] = [];

  if (remaining < 0) {
    warnings.push(MSG_INSUFFICIENT);
  }

  if (cleanBalance > 0) {
    const ratioAfter = remaining / cleanBalance;
    if (remaining >= 0 && ratioAfter < 0.2) {
      cautions.push(MSG_TIGHT);
    }
  }

  return { remaining, warnings, cautions };
}
