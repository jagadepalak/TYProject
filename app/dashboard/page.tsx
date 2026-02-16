"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.email) {
      router.replace("/auth/login");
      return;
    }

    sanityClient
      .fetch(`*[_type == "user" && email == $email][0]`, {
        email: session.user.email,
      })
      .then((user) => {
        if (!user) {
          router.replace("/auth/login");
        } else if (!user.role) {
          router.replace("/select-role");
        } else {
          setRole(user.role);
        }
      })
      .catch(() => {
        router.replace("/auth/login");
      });
  }, [session, status, router]);

  // 🔄 Proper loading screen
  if (status === "loading" || role === null) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 text-white px-6 py-10"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold capitalize">
            {role} Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome, {session?.user?.name}
          </p>
        </div>

        {/* Role-based cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {role === "admin" && (
            <>
              <Card title="Manage Users" href="/admin/users" />
              <Card title="Approve Startups" href="/admin/startups" />
              <Card title="Reports" href="/admin/reports" />
              <Card title="Approve Investments" href="/admin/investments" />
              <Card title="View Feedback" href="/admin/feedback" />

            </>
          )}

          {role === "entrepreneur" && (
            <>
              <Card title="Submit Startup" href="/startup/submit" />
              <Card title="My Startups" href="/startup/list" />
              <Card title="View Feedback" href="/entrepreneur/feedback"/>
            </>
          )}

          {role === "investor" && (
            <>
              <Card title="Browse Startups" href="/investor/startups" />
              <Card title="My Investments" href="/investor/investments" />
              <Card title="Investments Received" href="/entrepreneur/investments" />
            </>
          )}

        </div>
      </div>
    </motion.div>
  );
}

function Card({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-2xl transition"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-400 mt-2">Click to continue</p>
    </Link>
  );
}
