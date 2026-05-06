import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";

const nav = [
  { href: "/dashboard", label: "Beranda" },
  { href: "/budget", label: "Budget" },
  { href: "/wishlist", label: "Wishlist" },
] as const;

/** Layout bersih dengan navigasi bawah (mobile-first Gen Z). */
export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
            FINTARA
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="max-w-[120px] truncate">{session.user.email}</span>
              <SignOutButton />
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">{children}</main>

      {session?.user ? (
        <nav className="sticky bottom-0 border-t border-zinc-200 bg-white/95 pb-safe pt-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
          <ul className="mx-auto flex max-w-lg justify-around px-2 pb-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-800 dark:text-zinc-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
