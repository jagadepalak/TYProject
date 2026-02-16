import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  const {
    startup_name,
    description,
    industry,
    entrepreneur_id,
  } = await req.json();

  await sanityWriteClient.create({
    _type: "startup",
    startup_name,
    description,
    industry,
    entrepreneur_id,
    status: "Pending",
  });

  return new Response("Startup submitted successfully");
}
