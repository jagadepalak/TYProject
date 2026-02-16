"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SubmitFeedbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();

  const startupId = params.startupId as string;

  const investorEmail = session?.user?.email; // ✅ SAFE extraction

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔄 Loading
  if (status === "loading") {
    return <LoadingSpinner text="Preparing feedback..." />;
  }

  // 🔐 Not logged in
  if (!session || !investorEmail) {
    router.replace("/auth/login");
    return null;
  }

  const submitFeedback = async () => {
    if (!message.trim()) {
      toast.error("Please write feedback");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/feedback/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedback_text: message,
        startup_id: startupId,
        investor_email: investorEmail, // ✅ SAFE usage
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      toast.success("Feedback submitted successfully ✨");
      router.push("/investor");
    } else {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-4"
    >
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Submit Feedback
        </h1>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full p-4 bg-gray-900 rounded mb-6 outline-none focus:ring-2 focus:ring-indigo-500"
          rows={5}
        />

        <button
          onClick={submitFeedback}
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-3 rounded-lg font-semibold"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </motion.div>
  );
}
