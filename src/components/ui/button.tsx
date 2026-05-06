import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

/**
 * Tombol konsisten untuk seluruh app (mobile-first, area tap nyaman).
 */
export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";
  const styles: Record<NonNullable<Props["variant"]>, string> = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-500",
    secondary:
      "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
    ghost: "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-500",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} type="button" {...props} />;
}
