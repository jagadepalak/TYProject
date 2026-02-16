import { sanityClient } from "./sanityClient";

export async function getUserByEmail(email: string) {
  return sanityClient.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email }
  );
}
