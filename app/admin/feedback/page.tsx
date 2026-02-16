"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";

export default function AdminFeedbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const adminEmail = session?.user?.email;

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminEmail) return;

    const fetchFeedbacks = async () => {
      // 🔐 Check admin
      const admin = await sanityClient.fetch(
        `*[_type=="user" && email==$email][0]`,
        { email: adminEmail }
      );

      if (!admin || admin.role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      // 📥 Fetch all feedback
      const data = await sanityClient.fetch(`
        *[_type=="feedback"] | order(date desc){
          _id,
          feedback_text,
          investor_email,
          date,
          startup_id
        }
      `);

      setFeedbacks(data);
      setLoading(false);
    };

    fetchFeedbacks();
  }, [adminEmail, router]);

  // 🔄 Loading
  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading feedback..." />;
  }

  // 🔐 Not logged in
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
        <h1 className="text-3xl font-bold mb-8">All Feedback</h1>

        {feedbacks.length === 0 ? (
          <p className="text-gray-400">No feedback available.</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <div
                key={fb._id}
                className="bg-gray-800 p-5 rounded-xl shadow"
              >
                <p className="text-gray-200 mb-3">
                  {fb.feedback_text}
                </p>

                <div className="text-sm text-gray-400 flex justify-between">
                  <span>Investor: {fb.investor_email}</span>
                  <span>
                    {new Date(fb.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
