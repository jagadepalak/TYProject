"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminStartupsPage() {
  const { data: session, status } = useSession();
  const [startups, setStartups] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Fetch logged-in user role
    sanityClient
      .fetch(`*[_type == "user" && email == $email][0]`, {
        email: session.user.email,
      })
      .then((user) => {
        if (user?.role !== "admin") {
          redirect("/dashboard");
        } else {
          setRole("admin");
        }
      });

    // Fetch all startups
    sanityClient
      .fetch(`*[_type == "startup"] | order(_createdAt desc)`)
      .then(setStartups);
  }, [session]);

  // ✅ NEW — Reject with Reason
  const rejectStartup = async (startupId: string) => {
    const reason = prompt("Enter rejection reason");

    if (!reason || reason.trim() === "") {
      toast.error("Rejection reason is required");
      return;
    }

    const res = await fetch("/api/startup/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: startupId,
        reason,
      }),
    });

    if (res.ok) {
      toast.error("Startup rejected ❌");

      // refresh list
      const updated = await sanityClient.fetch(
        `*[_type == "startup"] | order(_createdAt desc)`
      );
      setStartups(updated);
    } else {
      toast.error("Failed to reject startup");
    }
  };

  // 🔄 Loading
  if (status === "loading" || role === null) {
    return <LoadingSpinner text="Loading startup approvals..." />;
  }

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 text-white px-6 py-10"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Startup Approvals
        </h1>

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

              <p className="text-sm text-gray-400 mb-2">
                Industry: {startup.industry}
              </p>

              <p className="text-sm mb-4">
                Status:{" "}
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="font-semibold inline-block"
                >
                  {startup.status}
                </motion.span>
              </p>

              {startup.status === "Pending" && (
                <div className="flex gap-4">

                  {/* APPROVE */}
                  <motion.form
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    action={`/api/startup/update-status?id=${startup._id}&status=Approved`}
                    method="POST"
                    onSubmit={() => toast.success("Startup approved ✅")}
                  >
                    <button className="bg-green-600 px-4 py-2 rounded">
                      Approve
                    </button>
                  </motion.form>

                  {/* ❌ REJECT WITH REASON */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => rejectStartup(startup._id)}
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Reject
                  </motion.button>

                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
