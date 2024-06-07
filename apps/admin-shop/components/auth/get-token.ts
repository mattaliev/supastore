import { getServerSession } from "next-auth";

import { authOptions, DEFAULT_CALLBACK_URL, redirectToAuth } from "@/auth";

export async function getAccessToken(): Promise<string | never> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    return await redirectToAuth({ callbackUrl: DEFAULT_CALLBACK_URL });
  }

  return session.user.accessToken;
}
