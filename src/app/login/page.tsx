import { Suspense } from "react";
import { BrandLogo } from "@/components/branding/brand-logo";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12">
      <div className="glass-card mb-5 flex items-center justify-center py-5">
        <BrandLogo size="md" />
      </div>
      <Suspense fallback={<p className="text-sm text-slate-600 dark:text-white/60">Memuat…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
