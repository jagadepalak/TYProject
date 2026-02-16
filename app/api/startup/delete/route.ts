import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  const { id, email } = await req.json();

  if (!id || !email) {
    return new Response("Invalid request", { status: 400 });
  }

  // Fetch startup
  const startup = await sanityWriteClient.fetch(
    `*[_type=="startup" && _id==$id][0]`,
    { id }
  );

  if (!startup) {
    return new Response("Startup not found", { status: 404 });
  }

  // Security check: only owner
  if (startup.entrepreneur_id !== email) {
    return new Response("Unauthorized", { status: 403 });
  }

  // Only pending startups can be deleted
  if (startup.status !== "Pending") {
    return new Response("Cannot delete approved startup", { status: 403 });
  }

  await sanityWriteClient.delete(id);

  return new Response("Startup deleted successfully");
}
