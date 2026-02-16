import { sanityWriteClient } from "@/lib/sanityClient";

// ❌ Roles users are ALLOWED to choose
const ALLOWED_ROLES = ["entrepreneur", "investor"];

export async function POST(req: Request) {
  const { email, role } = await req.json();

  // 🔒 Block admin assignment from API
  if (!ALLOWED_ROLES.includes(role)) {
    return new Response("Invalid role selection", { status: 400 });
  }

  const user = await sanityWriteClient.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email }
  );

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  // 🔒 Prevent overwriting admin role
  if (user.role === "admin") {
    return new Response("Admin role cannot be changed", {
      status: 403,
    });
  }

  await sanityWriteClient
    .patch(user._id)
    .set({ role })
    .commit();

  return new Response("Role saved successfully");
}
