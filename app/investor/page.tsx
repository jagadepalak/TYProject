"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function InvestorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;

    const fetchData = async () => {
      try {
        // ✅ Fetch user role
        const user = await sanityClient.fetch(
          `*[_type=="user" && email==$email][0]`,
          { email: userEmail }
        );

        // ❌ BLOCK ADMIN + ENTREPRENEUR
        if (!user || user.role !== "investor") {
          toast.error("Only investors can access this page");
          router.replace("/dashboard");
          return;
        }

        // ✅ Fetch approved startups
        const data = await sanityClient.fetch(
          `*[_type=="startup" && status=="Approved"] | order(_createdAt desc)`
        );

        setStartups(data);
      } catch {
        toast.error("Failed to load startups");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail, router]);

  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading approved startups..." />;
  }

  if (!userEmail) {
    router.replace("/auth/login");
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8"
    >
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Browse Startups</h1>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>

        {startups.length === 0 ? (
          <p className="text-gray-400">No approved startups available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {startups.map((startup) => (
              <motion.div
                key={startup._id}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-indigo-400 mb-2">
                  {startup.startup_name}
                </h2>

                <p className="text-gray-300 mb-3">
                  {startup.description}
                </p>

                <p className="text-sm text-gray-400 mb-4">
                  Industry: {startup.industry || "N/A"}
                </p>

                <button
                  onClick={() =>
                    router.push(`/investor/invest/${startup._id}`)
                  }
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold mb-2"
                >
                  Invest
                </button>

                <button
                  onClick={() =>
                    router.push(`/investor/feedback/${startup._id}`)
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold"
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
