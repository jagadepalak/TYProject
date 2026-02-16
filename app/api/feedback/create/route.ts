import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const { message, startupId, investorEmail } = await req.json();

    if (!message || !startupId || !investorEmail) {
      return new Response("Missing fields", { status: 400 });
    }

    await sanityWriteClient.create({
      _type: "feedback",
      message,
      investor_email: investorEmail,
      startup: {
        _type: "reference",
        _ref: startupId,
      },
      createdAt: new Date().toISOString(),
    });

    return new Response("Feedback saved", { status: 200 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
}
