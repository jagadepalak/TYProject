import { sanityWriteClient } from "@/lib/sanityClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id, reason } = await req.json();

  if (!id || !reason) {
    return new Response("Missing data", { status: 400 });
  }

  await sanityWriteClient
    .patch(id)
    .set({
      status: "Rejected",
      rejection_reason: reason,
      rejected_by: session.user.email,
      rejected_at: new Date().toISOString(),
    })
    .commit();

  return new Response("Investment rejected");
}
