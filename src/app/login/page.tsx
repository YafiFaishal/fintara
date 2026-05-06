import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12">
      <Suspense fallback={<p className="text-sm text-zinc-500">Memuat…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
