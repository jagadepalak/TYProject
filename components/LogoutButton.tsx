"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
    >
      Logout
    </button>
  );
}
