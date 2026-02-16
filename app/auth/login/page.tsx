"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";


export default function LoginPage() {
  const handleGoogleLogin = async () => {
    toast.loading("Signing in with Google...");
    await signIn("google", { callbackUrl: "/post-login" });
  };

  const handleEmailLogin = async () => {
    toast.loading("Signing in...");
    await signIn("credentials", {
      email: "test@gmail.com",
      password: "123456",
      callbackUrl: "/post-login",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-96 animate-slide-up">

        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">
          Login to StartupPitch
        </h2>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mb-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          Login with Google
        </button>

        <div className="text-center text-gray-400 mb-4">OR</div>

        {/* Email / Credentials Login */}
        <button
          onClick={handleEmailLogin}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          Login with Email
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
