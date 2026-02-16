"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SelectRolePage() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState("");
  const router = useRouter();

  // Safety: if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const submitRole = async () => {
    if (!role || !session?.user?.email) {
      toast.error("Please select a role");
      return;
    }

    await fetch("/api/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        role,
      }),
    });

    toast.success("Role selected successfully 🎉");
    router.push("/dashboard");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md animate-fade-in">

        <h1 className="text-3xl font-bold text-center mb-6">
          Select Your Role
        </h1>

        {/* ✅ Role Dropdown (ADMIN REMOVED) */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
        >
          <option value="">-- Choose your role --</option>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="investor">Investor</option>
        </select>

        {/* Continue Button */}
        <button
          onClick={submitRole}
          disabled={!role}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
