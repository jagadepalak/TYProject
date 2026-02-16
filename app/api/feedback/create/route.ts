import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const { feedback_text, startup_id, investor_email } = await req.json();

    // ✅ Validation
    if (!feedback_text || !startup_id || !investor_email) {
      return new Response("Missing fields", { status: 400 });
    }

    // ✅ Save Feedback (Schema Matching)
    await sanityWriteClient.create({
      _type: "feedback",

      feedback_text,
      startup_id,
      investor_email,

      date: new Date().toISOString(),
    });

    return new Response("Feedback saved successfully", { status: 200 });

  } catch (error) {
    console.error("Feedback API Error:", error);
    return new Response("Server error", { status: 500 });
  }
}