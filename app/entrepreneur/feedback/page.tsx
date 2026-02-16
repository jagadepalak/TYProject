"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function EntrepreneurFeedbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ TS Safe Email Extraction
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;

    const fetchFeedback = async () => {
      try {
        // ✅ Step 1 — Get entrepreneur startups
        const startupIds: string[] = await sanityClient.fetch(
          `*[_type=="startup" && entrepreneur_id==$email]._id`,
          { email: userEmail }
        );

        // ✅ If no startups → stop early
        if (!startupIds || startupIds.length === 0) {
          setFeedbacks([]);
          return;
        }

        // ✅ Step 2 — Get feedback of those startups
        const feedbackData = await sanityClient.fetch(
          `*[_type=="feedback" && startup_id in $startupIds] | order(date desc)`,
          { startupIds }
        );

        setFeedbacks(feedbackData);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [userEmail]);

  // ✅ Loading Screen
  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading feedback..." />;
  }

  // ✅ Not logged in
  if (!userEmail) {
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
          <p className="text-gray-400">
            No feedback received yet.
          </p>
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