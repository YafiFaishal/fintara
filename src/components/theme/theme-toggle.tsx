"use client";

import { useAppTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { mounted, theme, setTheme } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass-btn-secondary min-h-0 px-3 py-1.5 text-xs font-semibold"
      aria-label="Ganti tema"
    >
      {mounted && isDark ? "Mode terang" : "Mode gelap"}
    </button>
  );
}
