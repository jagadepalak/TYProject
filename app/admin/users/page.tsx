"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    // 🔒 1️⃣ Verify admin role
    sanityClient
      .fetch(`*[_type=="user" && email==$email][0]`, {
        email: session.user.email,
      })
      .then((admin) => {
        if (admin?.role !== "admin") {
          redirect("/dashboard");
        } else {
          setIsAdmin(true);
        }
      });

    // 2️⃣ Fetch all users
    sanityClient
      .fetch(`*[_type=="user"] | order(_createdAt desc)`)
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, [session]);

  // Loading states
  if (status === "loading" || loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading users...
      </div>
    );
  }

  // 🔒 Delete user (admin-only API)
  const deleteUser = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      toast.success("User deleted successfully 🗑️");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } else {
      toast.error("Failed to delete user");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 text-white px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

        {users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 p-5 rounded-xl flex justify-between items-center shadow"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-1 bg-indigo-600 rounded">
                    {user.role || "N/A"}
                  </span>
                </div>

                {/* 🔒 Admin cannot delete admin */}
                {user.role !== "admin" && (
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                  >
                    Delete
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
