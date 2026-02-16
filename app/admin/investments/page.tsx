"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanityClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminInvestmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [investments, setInvestments] = useState<any[]>([]);

  // ✅ Reject Popup States
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const adminEmail = session?.user?.email;

  useEffect(() => {
    if (!adminEmail) return;

    // 🔐 Check admin role
    sanityClient
      .fetch(`*[_type=="user" && email==$email][0]`, {
        email: adminEmail,
      })
      .then((user) => {
        if (user?.role !== "admin") {
          router.replace("/dashboard");
        }
      });

    // ✅ FETCH INVESTMENTS WITH STARTUP DETAILS
    sanityClient
      .fetch(
        `*[_type=="investment"] | order(_createdAt desc){
          _id,
          amount,
          status,
          investorEmail,
          startupName,
          startupId,
          entrepreneurEmail,
          rejection_reason,
          rejected_by,
          rejected_at,
          _createdAt
        }`
      )
      .then(setInvestments);
  }, [adminEmail, router]);

  if (status === "loading") return <p>Loading...</p>;

  // ✅ Approve Investment
  const approveInvestment = async (id: string) => {
    const res = await fetch("/api/investment/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "Approved",
        adminEmail,
      }),
    });

    if (res.ok) {
      toast.success("Investment Approved ✅");

      setInvestments((prev) =>
        prev.map((i) =>
          i._id === id ? { ...i, status: "Approved" } : i
        )
      );
    } else {
      toast.error("Failed to approve investment");
    }
  };

  // ✅ Reject Investment WITH REASON
  const rejectInvestment = async () => {
    if (!rejectId) return;

    if (!rejectReason) {
      toast.error("Please enter rejection reason");
      return;
    }

    const res = await fetch("/api/investment/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: rejectId,
        reason: rejectReason,
        adminEmail,
      }),
    });

    if (res.ok) {
      toast.success("Investment Rejected ❌");

      setInvestments((prev) =>
        prev.map((i) =>
          i._id === rejectId
            ? {
                ...i,
                status: "Rejected",
                rejection_reason: rejectReason,
                rejected_by: adminEmail,
                rejected_at: new Date().toISOString(),
              }
            : i
        )
      );

      setRejectId(null);
      setRejectReason("");
    } else {
      toast.error("Failed to reject investment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Investment Approvals
      </h1>

      <div className="space-y-4">
        {investments.map((inv) => (
          <div
            key={inv._id}
            className="bg-gray-800 p-5 rounded-xl flex justify-between items-center"
          >
            <div>
              {/* ✅ STARTUP DETAILS */}
              <p className="font-semibold text-lg">
                {inv.startupName || "Startup"}
              </p>

              {inv.entrepreneurEmail && (
                <p className="text-xs text-gray-500">
                  Entrepreneur: {inv.entrepreneurEmail}
                </p>
              )}

              <p className="text-sm text-gray-400 mt-1">
                Investor: {inv.investorEmail}
              </p>

              <p className="text-sm text-gray-400">
                Amount: ₹{inv.amount}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded mt-2 inline-block
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

              {/* ⭐ Show Rejection Details */}
              {inv.status === "Rejected" && inv.rejection_reason && (
                <div className="mt-2 text-sm text-red-400">
                  Reason: {inv.rejection_reason}
                </div>
              )}
            </div>

            {/* ⭐ ACTION BUTTONS */}
            {inv.status === "Pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() => approveInvestment(inv._id)}
                  className="bg-green-600 px-4 py-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => setRejectId(inv._id)}
                  className="bg-red-600 px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ⭐ REJECT POPUP */}
      {rejectId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">
              Reject Investment
            </h2>

            <textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 bg-gray-900 rounded mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={rejectInvestment}
                className="flex-1 bg-red-600 py-2 rounded"
              >
                Confirm Reject
              </button>

              <button
                onClick={() => {
                  setRejectId(null);
                  setRejectReason("");
                }}
                className="flex-1 bg-gray-600 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
