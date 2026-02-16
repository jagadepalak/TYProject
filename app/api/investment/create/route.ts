import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const { startupId, investorEmail, amount, message } = await req.json();

    // ✅ Validation
    if (!startupId || !investorEmail || !amount) {
      return new Response("Invalid data", { status: 400 });
    }

    // ✅ Create investment with FULL tracking fields
    await sanityWriteClient.create({
      _type: "investment",

      startup: {
        _type: "reference",
        _ref: startupId,
      },

      investorEmail,
      amount: Number(amount),
      message: message || "",

      status: "Pending",

      // ⭐ NEW FIELDS
      resubmit_count: 0,
      max_resubmit: 2,
      created_at: new Date().toISOString(),
    });

    return new Response("Investment created", { status: 200 });

  } catch (error) {
    console.error("Investment create error:", error);
    return new Response("Server error", { status: 500 });
  }
}