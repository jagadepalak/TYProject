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
            startup->{
              _id,
              startup_name,
              industry
            },
            rejection_reason,
            rejected_by,
            rejected_at,
            resubmit_count,
            max_resubmit,
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

  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading your investments..." />;
  }

  if (!userEmail) {
    router.replace("/auth/login");
    return null;
  }

  // ⭐ RESUBMIT FUNCTION
  const resubmitInvestment = async (inv: any) => {
    try {
      if ((inv.resubmit_count || 0) >= (inv.max_resubmit || 2)) {
        toast.error("Resubmit limit reached");
        return;
      }

      const res = await fetch("/api/investment/resubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inv._id }),
      });

      if (res.ok) {
        toast.success("Investment Resubmitted 🔁");

        setInvestments((prev) =>
          prev.map((i) =>
            i._id === inv._id
              ? {
                  ...i,
                  status: "Pending",
                  resubmit_count: (i.resubmit_count || 0) + 1,
                }
              : i
          )
        );
      } else {
        toast.error("Failed to resubmit");
      }
    } catch {
      toast.error("Error resubmitting investment");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-900 text-white px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Investments</h1>

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
                {/* Startup Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">
                      {inv.startup?.startup_name}
                    </p>

                    <p className="text-sm text-gray-400">
                      Industry: {inv.startup?.industry || "N/A"}
                    </p>

                    <p className="text-sm text-gray-400">
                      Amount Invested: ₹{inv.amount}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Invested On:{" "}
                      {new Date(inv._createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status */}
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

                {/* Rejection Section */}
                {inv.status === "Rejected" && (
                  <div className="mt-4 border-t border-gray-700 pt-3 text-sm space-y-1">
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

                    {/* Limit Info */}
                    <p className="text-xs text-gray-500">
                      Resubmit Used: {inv.resubmit_count || 0} /{" "}
                      {inv.max_resubmit || 2}
                    </p>

                    {/* Resubmit Button */}
                    {(inv.resubmit_count || 0) <
                      (inv.max_resubmit || 2) && (
                      <button
                        onClick={() => resubmitInvestment(inv)}
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
                      >
                        Resubmit Investment
                      </button>
                    )}
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