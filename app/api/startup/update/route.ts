import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const { id, startup_name, description, industry } = await req.json();

    // ❌ Validation
    if (!id || !startup_name || !description) {
      return new Response("Missing required fields", { status: 400 });
    }

    // ✅ Update startup
    await sanityWriteClient
      .patch(id)
      .set({
        startup_name,
        description,
        industry,
      })
      .commit();

    return new Response("Startup updated successfully", { status: 200 });
  } catch (error) {
    console.error("Update startup error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
