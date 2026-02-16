import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  const { startupId, investorEmail, amount, message } = await req.json();

  if (!startupId || !investorEmail || !amount) {
    return new Response("Invalid data", { status: 400 });
  }

  await sanityWriteClient.create({
    _type: "investment",
    startup: {
      _type: "reference",
      _ref: startupId,
    },
    investorEmail,
    amount: Number(amount),
    message,
    status: "Pending",
  });

  return new Response("Investment created", { status: 200 });
}
