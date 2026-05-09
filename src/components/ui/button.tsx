import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

/**
 * Tombol konsisten untuk seluruh app (mobile-first, area tap nyaman).
 */
export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";
  const styles: Record<NonNullable<Props["variant"]>, string> = {
    primary: "glass-btn-primary focus-visible:outline-[var(--primary)]",
    secondary: "glass-btn-secondary focus-visible:outline-[var(--primary)]",
    ghost: "text-[var(--secondary)] hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-900/30",
    danger:
      "rounded-full border border-red-400/35 bg-red-500/85 text-white shadow-lg shadow-red-500/20 hover:bg-red-500 focus-visible:outline-rose-500",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} type="button" {...props} />;
}
