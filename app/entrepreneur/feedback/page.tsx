"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";

export default function EntrepreneurFeedbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = session?.user?.email; // ✅ safe extraction

    if (!email) return;

    const fetchFeedback = async () => {
      try {
        // 1️⃣ Fetch entrepreneur startups
        const startups: string[] = await sanityClient.fetch(
          `*[_type=="startup" && entrepreneur_id==$email]._id`,
          { email }
        );

        // 2️⃣ Fetch feedback for those startups
        const feedbackData = await sanityClient.fetch(
          `*[_type=="feedback" && startup_id in $startupIds] | order(date desc)`,
          { startupIds: startups }
        );

        setFeedbacks(feedbackData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [session]);

  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading feedback..." />;
  }

  if (!session) {
    router.replace("/auth/login");
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-900 text-white px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Feedback Received
        </h1>

        {feedbacks.length === 0 ? (
          <p className="text-gray-400">No feedback received yet.</p>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((fb) => (
              <motion.div
                key={fb._id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 p-6 rounded-xl shadow"
              >
                <p className="text-gray-300 mb-3">
                  {fb.feedback_text}
                </p>

                <p className="text-sm text-gray-400">
                  Investor: {fb.investor_email}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(fb.date).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
