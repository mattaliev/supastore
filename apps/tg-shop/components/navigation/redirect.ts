import { redirect as intlRedirect } from "@/components/i18n/i18n-navigation";
import { getStoreId } from "@/components/store/getStoreId";

type RedirectArgs = Parameters<typeof intlRedirect>;

export default function storeRedirect(...args: RedirectArgs): never {
  const storeId = getStoreId();
  const [url, ...rest] = args;
  const storeUrl = `/store/${storeId}${url}`;

  return intlRedirect(storeUrl, ...rest);
}
