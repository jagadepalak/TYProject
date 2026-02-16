import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  const { id, status } = await req.json();

  if (!id || !status) {
    return new Response("Invalid request", { status: 400 });
  }

  await sanityWriteClient
    .patch(id)
    .set({ status })
    .commit();

  return new Response("Investment updated");
}
