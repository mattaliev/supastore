import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/components/i18n/i18n";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
});

export default async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  const storeId =
    pathname.split("/").length >= 3 ? pathname.split("/")[3] : null;
  if (storeId) {
    // Set the storeId in request headers
    req.headers.set("x-store-id", storeId);
    req.cookies.set("store-id", storeId);
  }
  return intlMiddleware(req);
};

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en)/:path*"],
};
