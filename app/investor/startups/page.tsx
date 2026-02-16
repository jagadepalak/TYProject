"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function InvestorStartupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [startups, setStartups] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.user?.email) return;

    sanityClient
      .fetch(`*[_type=="startup" && status=="Approved"] | order(_createdAt desc)`)
      .then(setStartups);
  }, [session]);

  if (status === "loading") {
    return <LoadingSpinner text="Loading startups..." />;
  }

  if (!session) {
    router.replace("/auth/login");
    return null;
  }

  return (
    <motion.div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Approved Startups</h1>

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

              <button
                onClick={() =>
                  router.push(`/investor/invest/${startup._id}`)
                }
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
              >
                Invest
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
