import { sanityWriteClient } from "@/lib/sanityClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  // 1️⃣ Get session
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2️⃣ Fetch logged-in user from Sanity
  const user = await sanityWriteClient.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email: session.user.email }
  );

  // 3️⃣ 🔒 Only admin allowed
  if (user?.role !== "admin") {
    return new Response("Forbidden: Admin access only", {
      status: 403,
    });
  }

  // 4️⃣ Read query params
  const { searchParams } = new URL(req.url);
  const startupId = searchParams.get("id");
  const status = searchParams.get("status");

  // 5️⃣ Validate input
  if (!startupId || !status) {
    return new Response("Invalid request", { status: 400 });
  }

  if (!["Approved", "Rejected"].includes(status)) {
    return new Response("Invalid status value", { status: 400 });
  }

  // 6️⃣ Update startup status
  await sanityWriteClient
    .patch(startupId)
    .set({ status })
    .commit();

  // 7️⃣ Redirect back to admin page
  return new Response("Status updated", {
    status: 302,
    headers: {
      Location: "/admin/startups",
    },
  });
}
