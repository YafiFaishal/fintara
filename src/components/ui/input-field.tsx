import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputField({ label, error, id, className = "", ...props }: Props) {
  const lid = id ?? props.name ?? label;
  return (
    <label className="block w-full space-y-1">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <input
        id={lid}
        className={`w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
