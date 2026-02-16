"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  // ❌ Hide navbar on auth pages
  if (pathname.startsWith("/auth")) {
    return null;
  }

  const isLandingPage = pathname === "/";

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <nav className="w-full bg-gray-900 px-8 py-4 flex justify-between items-center animate-fade-in">

      {/* LOGO */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="p-1 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition">
          <img
            src="/logo.png"
            alt="StartupPitch Logo"
            className="w-8 h-8 object-contain"
          />
        </div>

        <span className="text-xl font-semibold tracking-wide text-indigo-400 group-hover:text-indigo-300 transition">
          Startup<span className="text-purple-400">Pitch</span>
        </span>
      </Link>

      {/* RIGHT MENU */}
      <div className="flex items-center gap-3">

        {/* LANDING PAGE → PUBLIC */}
        {isLandingPage && (
          <>
            <Link href="/auth/login" className={linkClass("/auth/login")}>
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
            >
              Register
            </Link>
          </>
        )}

        {/* DASHBOARD & OTHER PAGES */}
        {!isLandingPage && isLoggedIn && (
          <>
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/investor" className={linkClass("/investor")}>
              Investors
            </Link>
            <Link href="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
