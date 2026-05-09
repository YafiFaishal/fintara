"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      className="glass-btn-secondary min-h-0 px-3 py-1 text-xs"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Keluar
    </Button>
  );
}
