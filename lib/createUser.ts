import { sanityWriteClient } from "./sanityClient";

// 🔐 Only these emails can EVER be admin
const ADMIN_EMAILS = ["jagadepalak@gmail.com"]; // ← your email only

export async function createUser({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const role = ADMIN_EMAILS.includes(email)
    ? "admin"   // auto-assign admin
    : null;     // others must select role

  return sanityWriteClient.create({
    _type: "user",
    name,
    email,
    role,
  });
}
