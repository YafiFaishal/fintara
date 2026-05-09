"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/budget", label: "Budget", icon: "◫" },
  { href: "/wishlist", label: "Wishlist", icon: "♡" },
  { href: "/analytics", label: "Analitik", icon: "⌁" },
  { href: "/rewards", label: "Rewards", icon: "✦" },
  { href: "/profile", label: "Profil", icon: "◯" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-30 px-4 pb-safe">
      <ul className="glass-card mx-auto grid max-w-md grid-cols-6 gap-1 rounded-full bg-white/70 px-2 py-2 shadow-2xl shadow-cyan-950/10 dark:bg-white/[0.05]">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1 text-center text-[10px] font-semibold transition hover:bg-white/45 hover:text-cyan-800 dark:hover:bg-white/10 dark:hover:text-cyan-100 ${
                  active
                    ? "text-cyan-800 dark:text-cyan-100"
                    : "text-slate-700 dark:text-white/70"
                }`}
              >
                <span className="text-lg leading-none transition group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.75)]">
                  {item.icon}
                </span>
                <span className="max-w-full truncate">{item.label}</span>
                <span
                  className={`absolute bottom-1 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.95)] transition ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
