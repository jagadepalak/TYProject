"use client";

import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">

      {/* 🔵 Animated Background Blobs */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-120px] left-[-120px] w-72 h-72 bg-indigo-600 rounded-full opacity-20 blur-3xl"
      />

      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-[200px] right-[-120px] w-72 h-72 bg-purple-600 rounded-full opacity-20 blur-3xl"
      />

      <motion.div
        animate={{ x: [0, 10, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute bottom-[-120px] left-[40%] w-72 h-72 bg-pink-600 rounded-full opacity-20 blur-3xl"
      />

      {/* CONTENT */}
      <div className="relative z-10">

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mt-20 px-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold max-w-3xl">
            Where <span className="text-indigo-400">Startups</span> Meet{" "}
            <span className="text-purple-400">Investors</span>
          </h2>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            A modern platform where startups pitch ideas and investors discover
            promising opportunities.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-10 flex gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              href="/auth/register"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg shadow-lg"
            >
              Get Started
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              href="/auth/login"
              className="px-6 py-3 border border-indigo-500 text-indigo-400 hover:bg-gray-800 rounded-xl text-lg shadow-lg"
            >
              Login
            </motion.a>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="mt-28 px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Pitch Ideas",
              color: "text-indigo-400",
              desc: "Submit and showcase innovative startup ideas.",
            },
            {
              title: "Find Investors",
              color: "text-purple-400",
              desc: "Connect with investors looking for the next big opportunity.",
            },
            {
              title: "Secure Platform",
              color: "text-green-400",
              desc: "Secure authentication and data handling.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.07 }}
              className="bg-gray-800 rounded-2xl shadow-xl p-6 text-center transition"
            >
              <h3 className={`text-xl font-bold ${item.color} mb-2`}>
                {item.title}
              </h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ⭐ YOUR DETAILS FOOTER */}
        <footer className="mt-32 border-t border-gray-800 py-10 text-center">
          <h3 className="text-xl font-semibold text-indigo-400">
            Developed By
          </h3>

          <p className="mt-2 text-lg font-medium">
            Palak Jagade
          </p>

          <p className="text-gray-400 text-sm mt-1">
            TY BSc IT — D.G. Ruparel College
          </p>

          <p className="text-gray-500 text-sm">
            Mumbai University
          </p>

          <p className="text-gray-400 text-sm mt-3">
            📧 jagadepalak@gmail.com
          </p>

          <p className="text-gray-500 text-xs mt-4">
            Startup Pitching Platform — Final Year Project
          </p>
        </footer>

      </div>
    </div>
  );
}