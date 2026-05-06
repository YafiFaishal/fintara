import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Lindungi rute aplikasi; publik: beranda, login, register, auth API.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const loggedIn = !!req.auth;

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/register";

  if (!loggedIn && !isPublic) {
    const login = new URL("/login", req.nextUrl);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (loggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
