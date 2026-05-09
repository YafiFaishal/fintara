import Link from "next/link";
import { auth } from "@/auth";
import { BottomNav } from "@/components/bottom-nav";
import { BrandLogo } from "@/components/branding/brand-logo";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/** Layout bersih dengan navigasi bawah (mobile-first Gen Z). */
export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-col text-[#1a1a2e] dark:text-white">
      <header className="sticky top-0 z-20 border-b border-white/25 bg-white/55 px-4 py-3 shadow-sm shadow-cyan-900/5 backdrop-blur-[20px] dark:border-white/10 dark:bg-white/[0.04]">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BrandLogo size="sm" />
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
              <ThemeToggle />
              <SignOutButton />
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-28 pt-6">{children}</main>

      {session?.user ? <BottomNav /> : null}
    </div>
  );
}
