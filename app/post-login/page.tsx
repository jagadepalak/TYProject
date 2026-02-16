import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/getUserByEmail";
import { createUser } from "@/lib/createUser";

export default async function PostLoginPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = await getUserByEmail(session.user.email);

  // FIRST LOGIN
  if (!user) {
    await createUser({
      name: session.user.name || "User",
      email: session.user.email,
    });

    redirect("/select-role");
  }

  // EXISTING USER
  redirect("/dashboard");
}
