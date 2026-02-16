import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const { startupId, investorEmail, amount, message } = await req.json();

    // ✅ Validation
    if (!startupId || !investorEmail || !amount) {
      return new Response("Invalid data", { status: 400 });
    }

    // ⭐ STEP 1 — Fetch Startup Details (for snapshot)
    const startup = await sanityWriteClient.fetch(
      `*[_type=="startup" && _id==$id][0]{
        startup_name,
        industry,
        entrepreneur_id
      }`,
      { id: startupId }
    );

    if (!startup) {
      return new Response("Startup not found", { status: 404 });
    }

    // ⭐ STEP 2 — Create Investment WITH SNAPSHOT DATA
    await sanityWriteClient.create({
      _type: "investment",

      // Reference
      startup: {
        _type: "reference",
        _ref: startupId,
      },

      // Snapshot fields (VERY IMPORTANT)
      startup_name: startup.startup_name,
      startup_industry: startup.industry,
      entrepreneur_email: startup.entrepreneur_id,

      // Investment data
      investorEmail,
      amount: Number(amount),
      message: message || "",

      status: "Pending",

      // Tracking
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