import { sanityWriteClient } from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response("User ID missing", { status: 400 });
    }

    // 🔥 Delete user
    await sanityWriteClient.delete(id);

    return new Response("User deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Delete user error:", error);
    return new Response("Failed to delete user", { status: 500 });
  }
}
