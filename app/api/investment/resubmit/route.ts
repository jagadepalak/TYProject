import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const { investmentId } = await req.json();

    if (!investmentId) {
      return new Response("Investment ID required", { status: 400 });
    }

    // 🔎 Fetch current investment
    const investment = await sanityWriteClient.fetch(
      `*[_type=="investment" && _id==$id][0]`,
      { id: investmentId }
    );

    if (!investment) {
      return new Response("Investment not found", { status: 404 });
    }

    // 🚫 Limit Check
    if (investment.resubmit_count >= (investment.max_resubmit || 2)) {
      return new Response("Resubmit limit reached", { status: 403 });
    }

    // 🔁 Update
    await sanityWriteClient
      .patch(investmentId)
      .set({
        status: "Pending",
        resubmit_count: (investment.resubmit_count || 0) + 1,
      })
      .unset([
        "rejection_reason",
        "rejected_by",
        "rejected_at",
      ])
      .commit();

    return new Response("Resubmitted successfully");
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
}
