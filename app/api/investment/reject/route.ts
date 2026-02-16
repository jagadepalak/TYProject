import { sanityWriteClient, sanityClient } from "@/lib/sanityClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id, reason } = await req.json();

    if (!id || !reason) {
      return new Response("Missing data", { status: 400 });
    }

    // ⭐ Get current investment first
    const investment = await sanityClient.fetch(
      `*[_type=="investment" && _id==$id][0]{
        _id,
        resubmit_count,
        max_resubmit
      }`,
      { id }
    );

    if (!investment) {
      return new Response("Investment not found", { status: 404 });
    }

    const currentCount = investment.resubmit_count || 0;
    const maxLimit = investment.max_resubmit || 2;

    // ⭐ Increase count
    const newCount = currentCount + 1;

    await sanityWriteClient
      .patch(id)
      .set({
        status: "Rejected",
        rejection_reason: reason,
        rejected_by: session.user.email,
        rejected_at: new Date().toISOString(),
        resubmit_count: newCount,
      })
      .commit();

    return new Response("Investment rejected", { status: 200 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
}