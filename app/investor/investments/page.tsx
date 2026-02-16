"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanityClient";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function InvestorInvestmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Extract email safely
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;

    const fetchInvestments = async () => {
      try {
        const data = await sanityClient.fetch(
          `*[_type=="investment" && investorEmail==$email] | order(_createdAt desc){
            _id,
            amount,
            status,
            startupName,
            entrepreneurEmail,
            rejection_reason,
            rejected_by,
            rejected_at,
            _createdAt
          }`,
          { email: userEmail }
        );

        setInvestments(data);
      } catch {
        toast.error("Failed to load investments");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [userEmail]);

  // 🔄 Loading
  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading your investments..." />;
  }

  // 🔐 Not logged in
  if (!userEmail) {
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
          My Investments
        </h1>

        {investments.length === 0 ? (
          <p className="text-gray-400">
            You have not invested in any startups yet.
          </p>
        ) : (
          <div className="space-y-4">
            {investments.map((inv) => (
              <motion.div
                key={inv._id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 p-5 rounded-xl shadow"
              >
                {/* LEFT SIDE INFO */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">
                      {inv.startupName}
                    </p>

                    <p className="text-sm text-gray-400">
                      Entrepreneur: {inv.entrepreneurEmail}
                    </p>

                    <p className="text-sm text-gray-400">
                      Amount Invested: ₹{inv.amount}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Invested On:{" "}
                      {new Date(inv._createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* STATUS BADGE */}
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

                {/* ❌ REJECTION DETAILS */}
                {inv.status === "Rejected" && (
                  <div className="mt-4 border-t border-gray-700 pt-3 text-sm">
                    {inv.rejection_reason && (
                      <p className="text-red-400">
                        Reason: {inv.rejection_reason}
                      </p>
                    )}

                    {inv.rejected_by && (
                      <p className="text-gray-400">
                        Rejected By: {inv.rejected_by}
                      </p>
                    )}

                    {inv.rejected_at && (
                      <p className="text-gray-400">
                        Rejected On:{" "}
                        {new Date(inv.rejected_at).toLocaleDateString()}
                      </p>
                    )}

                    {/* Optional message */}
                    <p className="text-xs text-gray-500 mt-2">
                      You can create a new investment request if interested again.
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
