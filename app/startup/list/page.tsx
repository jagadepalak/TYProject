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

  const userEmail = session?.user?.email ?? "";

  // ✅ Fetch startups
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

  // ✅ Loading
  if (status === "loading") {
    return <LoadingSpinner text="Fetching your startups..." />;
  }

  // ✅ Not logged in
  if (!userEmail) {
    redirect("/auth/login");
  }

  // ✅ DELETE STARTUP
  const deleteStartup = async (id: string) => {
    const ok = confirm(
      "Are you sure you want to delete this startup?"
    );
    if (!ok) return;

    try {
      const res = await fetch("/api/startup/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Startup deleted successfully 🗑️");

        setStartups((prev) =>
          prev.filter((s) => s._id !== id)
        );
      } else {
        const msg = await res.text();
        toast.error(msg || "Delete failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-900 text-white px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Startups
        </h1>

        {startups.length === 0 ? (
          <p className="text-gray-400">
            No startups submitted yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {startups.map((startup) => (
              <motion.div
                key={startup._id}
                whileHover={{ scale: 1.04 }}
                className="bg-gray-800 p-6 rounded-xl shadow"
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

                {/* Status Badge */}
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

                {/* Delete only if Pending */}
                {startup.status === "Pending" && (
                  <button
                    onClick={() => deleteStartup(startup._id)}
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded"
                  >
                    Delete Startup
                  </button>
                )}

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </motion.div>
  );
}