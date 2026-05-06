"use client";

import { SessionProvider } from "next-auth/react";

/** Wrapper client untuk next-auth (signIn / useSession di komponen klien). */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
