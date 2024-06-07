import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies, headers } from "next/headers";

import { redirect as intlRedirect } from "@/components/i18n/i18n-navigation";

export function getStoreId(): string {
  try {
    const headerList = headers();

    let storeId: string | undefined | null = headerList.get("x-store-id");

    if (!storeId) {
      storeId = cookies().get("x-store-id")?.value;
    }

    if (!storeId) {
      return intlRedirect("/store");
    }

    return storeId;
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }
    throw new Error(
      process.env.NODE_ENV === "development"
        ? "You are trying to use getStoreId outside of a request context. This function should only be used in Server Components"
        : ""
    );
  }
}
