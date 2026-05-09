import { BrandLogo } from "@/components/branding/brand-logo";

export default function SplashPage() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="glass-card cyan-glow flex flex-col items-center px-10 py-14">
        <div className="animate-pulse">
          <BrandLogo size="lg" />
        </div>
        <p className="mt-6 text-sm font-semibold tracking-widest text-cyan-700 dark:text-cyan-200">
          Build calm. Spend smart.
        </p>
      </div>
    </div>
  );
}
