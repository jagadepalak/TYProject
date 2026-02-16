"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function InvestPage() {
  const { data: session } = useSession();
  const { startupId } = useParams();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const submitInvestment = async () => {
    if (!amount) {
      toast.error("Enter investment amount");
      return;
    }

    const res = await fetch("/api/investment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startupId,
        amount,
        message,
        investorEmail: session?.user?.email,
      }),
    });

    if (res.ok) {
      toast.success("Investment submitted 💰");
      router.push("/dashboard");
    } else {
      toast.error("Failed to invest");
    }
  };

  return (
    <motion.div className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-4">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Make Investment
        </h1>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-900 rounded"
        />

        <textarea
          placeholder="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-900 rounded"
        />

        <button
          onClick={submitInvestment}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          Submit Investment
        </button>
      </div>
    </motion.div>
  );
}
