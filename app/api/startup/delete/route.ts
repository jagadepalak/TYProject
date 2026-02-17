import { sanityWriteClient } from "@/lib/sanityClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return new Response("Invalid request", { status: 400 });
    }

    // ✅ Fetch startup
    const startup = await sanityWriteClient.fetch(
      `*[_type=="startup" && _id==$id][0]`,
      { id }
    );

    if (!startup) {
      return new Response("Startup not found", { status: 404 });
    }

    // ✅ Security check
    if (startup.entrepreneur_id !== session.user.email) {
      return new Response("Unauthorized", { status: 403 });
    }

    // ✅ Only Pending startups can be deleted
    if (startup.status !== "Pending") {
      return new Response(
        "Cannot delete approved or rejected startup",
        { status: 403 }
      );
    }

    // ✅ Delete
    await sanityWriteClient.delete(id);

    return new Response("Startup deleted successfully");

  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}