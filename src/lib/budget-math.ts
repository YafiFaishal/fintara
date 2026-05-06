/**
 * Saldo bersih = pemasukan bulanan − total kebutuhan pokok.
 */
export function computeCleanBalance(totalIncome: number, necessityAmounts: number[]): number {
  const sumNec = necessityAmounts.reduce((a, b) => a + b, 0);
  return totalIncome - sumNec;
}
