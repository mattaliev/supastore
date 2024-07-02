"use server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import storeRedirect from "@/components/navigation/redirect";

export async function getInitDataRaw() {
  const session = await getServerSession(authOptions);

  if (!session) return await storeRedirect("/unauthenticated");

  return session.user.initDataRaw;
}
