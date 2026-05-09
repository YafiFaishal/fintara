import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputField({ label, error, id, className = "", ...props }: Props) {
  const lid = id ?? props.name ?? label;
  return (
    <label className="block w-full space-y-1">
      <span className="text-sm font-medium text-[#1a1a2e] dark:text-white">{label}</span>
      <input
        id={lid}
        className={`glass-input w-full px-3 py-2.5 placeholder:text-slate-500 dark:placeholder:text-white/55 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
