"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = () => {
    alert("Account created successfully!");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-96 animate-slide-up">

        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleRegister}
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-indigo-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
