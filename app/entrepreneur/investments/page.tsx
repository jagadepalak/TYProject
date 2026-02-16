"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanityClient";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";

export default function EntrepreneurInvestmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !session.user?.email) return;

    const email = session.user.email; // ✅ FIX

    const fetchInvestments = async () => {
      const data = await sanityClient.fetch(
        `*[_type=="investment" && entrepreneurEmail==$email] | order(_createdAt desc){
          _id,
          amount,
          status,
          investorEmail,
          startupName
        }`,
        { email }
      );

      setInvestments(data);
      setLoading(false);
    };

    fetchInvestments();
  }, [session]);

  // 🔄 Loading
  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading investments..." />;
  }

  // 🔐 Not logged in
  if (!session) {
    router.replace("/auth/login");
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-900 text-white px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Investments Received
        </h1>

        {investments.length === 0 ? (
          <p className="text-gray-400">
            No investments received yet.
          </p>
        ) : (
          <div className="space-y-4">
            {investments.map((inv) => (
              <div
                key={inv._id}
                className="bg-gray-800 p-5 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{inv.startupName}</p>
                  <p className="text-sm text-gray-400">
                    Investor: {inv.investorEmail}
                  </p>
                  <p className="text-sm text-gray-400">
                    Amount: ₹{inv.amount}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      inv.status === "Approved"
                        ? "bg-green-600"
                        : inv.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                >
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
