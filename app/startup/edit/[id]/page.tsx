"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter, redirect } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditStartupPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    const userEmail = session?.user?.email;

    if (!userEmail || !id) return;

    sanityClient
      .fetch(`*[_type=="startup" && _id==$id][0]`, { id })
      .then((data) => {
        // ❌ Not found
        if (!data) {
          toast.error("Startup not found");
          router.replace("/startup/list");
          return;
        }

        // ❌ Not owner
        if (data.entrepreneur_id !== userEmail) {
          toast.error("Unauthorized access");
          router.replace("/dashboard");
          return;
        }

        // ❌ Not editable
        if (data.status !== "Pending") {
          toast.error("Only pending startups can be edited");
          router.replace("/startup/list");
          return;
        }

        // ✅ Fill form
        setStartupName(data.startup_name);
        setDescription(data.description);
        setIndustry(data.industry || "");
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load startup");
        router.replace("/dashboard");
      });
  }, [session, id, router]);

  if (status === "loading" || loading) {
    return <LoadingSpinner text="Loading startup details..." />;
  }

  if (!session) {
    redirect("/auth/login");
  }

  const updateStartup = async () => {
    if (!startupName || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    const res = await fetch("/api/startup/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        startup_name: startupName,
        description,
        industry,
      }),
    });

    if (res.ok) {
      toast.success("Startup updated successfully ✨");
      router.push("/startup/list");
    } else {
      toast.error("Failed to update startup");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-4"
    >
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Edit Startup
        </h1>

        <input
          value={startupName}
          onChange={(e) => setStartupName(e.target.value)}
          placeholder="Startup Name"
          className="w-full p-3 mb-4 bg-gray-900 rounded focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-3 mb-4 bg-gray-900 rounded focus:ring-2 focus:ring-indigo-500"
        />

        <input
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Industry"
          className="w-full p-3 mb-6 bg-gray-900 rounded focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={updateStartup}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}
