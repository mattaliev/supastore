import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

import { getStoreId } from "@/components/store/getStoreId";

type RevalidatePathArgs = Parameters<typeof revalidatePath>;

export default async function revalidateStorePath(...args: RevalidatePathArgs) {
  const [path, ...rest] = args;

  const storeId = await getStoreId();
  const locale = await getLocale();

  revalidatePath(`/${locale}/store/${storeId}${path}`, ...rest);
}
