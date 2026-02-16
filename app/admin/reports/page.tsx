"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function AdminReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ SAFE extraction (fixes red line error)
  const userEmail = session?.user?.email;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    startups: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!userEmail) return;

    const fetchData = async () => {
      // 🔐 Admin check
      const admin = await sanityClient.fetch(
        `*[_type=="user" && email==$email][0]`,
        { email: userEmail }
      );

      if (!admin || admin.role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      // 📊 Fetch statistics
      const users = await sanityClient.fetch(`count(*[_type=="user"])`);
      const startups = await sanityClient.fetch(`count(*[_type=="startup"])`);
      const approved = await sanityClient.fetch(
        `count(*[_type=="startup" && status=="Approved"])`
      );
      const pending = await sanityClient.fetch(
        `count(*[_type=="startup" && status=="Pending"])`
      );
      const rejected = await sanityClient.fetch(
        `count(*[_type=="startup" && status=="Rejected"])`
      );

      setStats({
        users,
        startups,
        approved,
        pending,
        rejected,
      });

      setLoading(false);
    };

    fetchData();
  }, [userEmail, router]);

  // 🔄 Loading state
  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading reports..." />;
  }

  // 🔐 Not logged in
  if (!session) {
    router.replace("/auth/login");
    return null;
  }

  const pieData = [
    { name: "Approved", value: stats.approved },
    { name: "Pending", value: stats.pending },
    { name: "Rejected", value: stats.rejected },
  ];

  const barData = [
    { name: "Users", value: stats.users },
    { name: "Startups", value: stats.startups },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-900 text-white px-6 py-10"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">Admin Reports</h1>

        {/* 📦 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Users" value={stats.users} />
          <StatCard title="Total Startups" value={stats.startups} />
          <StatCard title="Approved" value={stats.approved} />
          <StatCard title="Pending" value={stats.pending} />
        </div>

        {/* 📊 Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Pie Chart */}
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Startup Status Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Platform Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* 📦 Stat Card */
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow text-center">
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
