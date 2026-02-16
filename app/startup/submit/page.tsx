"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SubmitStartupPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");

  const submitStartup = async () => {
    if (!startupName || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await fetch("/api/startup/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startup_name: startupName,
          description,
          industry,
          entrepreneur_id: session?.user?.email,
        }),
      });

      toast.success("Startup submitted successfully 🚀");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Submit Startup
        </h1>

        <motion.input
          whileFocus={{ scale: 1.02 }}
          placeholder="Startup Name"
          className="w-full p-3 mb-4 bg-gray-900 rounded outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setStartupName(e.target.value)}
        />

        <motion.textarea
          whileFocus={{ scale: 1.02 }}
          placeholder="Description"
          className="w-full p-3 mb-4 bg-gray-900 rounded outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setDescription(e.target.value)}
        />

        <motion.input
          whileFocus={{ scale: 1.02 }}
          placeholder="Industry"
          className="w-full p-3 mb-6 bg-gray-900 rounded outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setIndustry(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={submitStartup}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition"
        >
          Submit Startup
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
