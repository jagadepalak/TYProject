import { sanityWriteClient } from "@/lib/sanityClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { id, reason } = await req.json();

    if (!id || !reason) {
      return new Response("Missing fields", { status: 400 });
    }

    await sanityWriteClient.patch(id).set({
      status: "Rejected",
      rejection_reason: reason,
      rejected_by: session?.user?.email || "admin",
      rejected_at: new Date().toISOString(),
    }).commit();

    return new Response("Rejected successfully");
  } catch {
    return new Response("Error rejecting startup", { status: 500 });
  }
}
