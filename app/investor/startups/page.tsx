"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

export default function InvestorStartupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;

    sanityClient
      .fetch(`*[_type=="startup" && status=="Approved"] | order(_createdAt desc)`)
      .then((data) => {
        setStartups(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load startups");
        setLoading(false);
      });
  }, [userEmail]);

  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading startups..." />;
  }

  if (!userEmail) {
    router.replace("/auth/login");
    return null;
  }

  return (
    <motion.div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Approved Startups</h1>

        {startups.length === 0 ? (
          <p className="text-gray-400">No approved startups available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {startups.map((startup) => (
              <motion.div
                key={startup._id}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-800 p-6 rounded-xl shadow"
              >
                <h2 className="text-xl font-bold mb-2">
                  {startup.startup_name}
                </h2>

                <p className="text-gray-300 mb-3">
                  {startup.description}
                </p>

                {/* INVEST BUTTON */}
                <button
                  onClick={() =>
                    router.push(`/investor/invest/${startup._id}`)
                  }
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded mb-3"
                >
                  Invest
                </button>

                {/* ⭐ FEEDBACK BUTTON */}
                <button
                  onClick={() =>
                    router.push(`/investor/feedback/${startup._id}`)
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded"
                >
                  Give Feedback
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}