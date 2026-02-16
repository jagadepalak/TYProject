import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const investmentId = body.id || body.investmentId;

    if (!investmentId) {
      return new Response("Investment ID required", { status: 400 });
    }

    // ⭐ Fetch current investment
    const investment = await sanityWriteClient.fetch(
      `*[_type=="investment" && _id==$id][0]{
        _id,
        resubmit_count,
        max_resubmit
      }`,
      { id: investmentId }
    );

    if (!investment) {
      return new Response("Investment not found", { status: 404 });
    }

    const currentCount = investment.resubmit_count || 0;
    const maxLimit = investment.max_resubmit || 2;

    // 🚫 Limit Check
    if (currentCount >= maxLimit) {
      return new Response("Resubmit limit reached", { status: 403 });
    }

    // ⭐ Update Investment
    await sanityWriteClient
      .patch(investmentId)
      .set({
        status: "Pending",
        resubmit_count: currentCount + 1,
      })
      .unset([
        "rejection_reason",
        "rejected_by",
        "rejected_at",
      ])
      .commit();

    return new Response("Resubmitted successfully", { status: 200 });

  } catch (error) {
    console.error("Resubmit Error:", error);
    return new Response("Server error", { status: 500 });
  }
}