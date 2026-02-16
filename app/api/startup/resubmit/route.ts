import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return new Response("Startup ID required", { status: 400 });
  }

  await sanityWriteClient
    .patch(id)
    .set({
      status: "Pending",
      rejection_reason: null,
      rejected_by: null,
      rejected_at: null,
    })
    .commit();

  return new Response("Startup resubmitted successfully");
}
