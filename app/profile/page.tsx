import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 px-6 py-12">

      <div className="max-w-4xl mx-auto animate-fade-in">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 animate-slide-up">

          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={session.user?.image || "https://via.placeholder.com/150"}
              alt="Profile Image"
              className="w-32 h-32 rounded-full border-4 border-indigo-500"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-semibold text-indigo-400">
              {session.user?.name || "User"}
            </h2>

            <p className="text-gray-300 mt-1">
              {session.user?.email}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-400">Account Type</p>
                <p className="font-medium">User</p>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-400">Login Method</p>
                <p className="font-medium">Google OAuth</p>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-400">Status</p>
                <p className="font-medium text-green-400">Active</p>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="font-medium">2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-4 animate-fade-in">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
          >
            Back to Dashboard
          </Link>

          <Link
            href="/startup/list"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition"
          >
            My Pitches
          </Link>
        </div>

      </div>
    </div>
  );
}
