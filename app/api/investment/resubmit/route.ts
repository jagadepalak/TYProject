import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { investmentId } = body;

    if (!investmentId) {
      return new Response("Investment ID required", { status: 400 });
    }

    // 🔁 Reset investment to Pending
    await sanityWriteClient
      .patch(investmentId)
      .set({
        status: "Pending",
        rejection_reason: null,
        rejected_by: null,
        rejected_at: null,
      })
      .commit();

    return new Response("Investment resubmitted successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Resubmit Error:", error);
    return new Response("Server error", { status: 500 });
  }
}
