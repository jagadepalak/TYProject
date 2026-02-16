"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

export default function MyStartupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [startups, setStartups] = useState<any[]>([]);

  // ✅ Safe email extraction
  const userEmail = session?.user?.email ?? "";

  // 🔄 Fetch startups
  useEffect(() => {
    if (!userEmail) return;

    sanityClient
      .fetch(
        `*[_type == "startup" && entrepreneur_id == $email] | order(_createdAt desc)`,
        { email: userEmail }
      )
      .then(setStartups)
      .catch(() => {
        toast.error("Failed to load startups");
      });
  }, [userEmail]);

  // 🔄 Loading spinner
  if (status === "loading") {
    return <LoadingSpinner text="Fetching your startups..." />;
  }

  // 🔐 Not logged in
  if (!userEmail) {
    redirect("/auth/login");
  }

  // 🗑️ Delete startup (ONLY Pending)
  const deleteStartup = async (id: string) => {
    const ok = confirm(
      "Are you sure you want to delete this startup? This action cannot be undone."
    );
    if (!ok) return;

    const res = await fetch("/api/startup/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      toast.success("Startup deleted successfully 🗑️");
      setStartups((prev) => prev.filter((s) => s._id !== id));
    } else {
      toast.error("Failed to delete startup");
    }
  };

  // 🔁 Resubmit rejected startup
  const resubmitStartup = async (id: string) => {
    const res = await fetch("/api/startup/resubmit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      toast.success("Startup resubmitted for approval 🚀");

      // Refresh list
      setStartups((prev) =>
        prev.map((s) =>
          s._id === id
            ? {
                ...s,
                status: "Pending",
                rejection_reason: null,
                rejected_by: null,
                rejected_at: null,
              }
            : s
        )
      );
    } else {
      toast.error("Failed to resubmit startup");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 text-white px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Startups</h1>

        {startups.length === 0 ? (
          <p className="text-gray-400">No startups submitted yet.</p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {startups.map((startup: any) => (
              <motion.div
                key={startup._id}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.04 }}
                className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-2xl transition"
              >
                <h2 className="text-xl font-bold mb-2">
                  {startup.startup_name}
                </h2>

                <p className="text-gray-300 mb-3">
                  {startup.description}
                </p>

                <p className="text-sm text-gray-400 mb-3">
                  Industry: {startup.industry || "N/A"}
                </p>

                {/* ✅ Status Badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      startup.status === "Approved"
                        ? "bg-green-600"
                        : startup.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                >
                  {startup.status}
                </span>

                {/* ❌ Rejection Details */}
                {startup.status === "Rejected" && (
                  <div className="mt-4 text-sm space-y-1">
                    {startup.rejection_reason && (
                      <p className="text-red-400">
                        Reason: {startup.rejection_reason}
                      </p>
                    )}

                    {startup.rejected_by && (
                      <p className="text-gray-400">
                        Rejected By: {startup.rejected_by}
                      </p>
                    )}

                    {startup.rejected_at && (
                      <p className="text-gray-500 text-xs">
                        Date: {new Date(startup.rejected_at).toLocaleString()}
                      </p>
                    )}

                    {/* 🔁 Resubmit Button */}
                    <button
                      onClick={() => resubmitStartup(startup._id)}
                      className="mt-3 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
                    >
                      Resubmit
                    </button>
                  </div>
                )}

                {/* ✏️ Edit / Delete ONLY if Pending */}
                {startup.status === "Pending" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() =>
                        router.push(`/startup/edit/${startup._id}`)
                      }
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteStartup(startup._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
