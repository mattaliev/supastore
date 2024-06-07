import { storeCanManage } from "@ditch/lib";
import { isRedirectError } from "next/dist/client/components/redirect";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";

import { authenticated, getAuthPageUrl, getErrorPageUrl } from "@/auth";
import { localePrefix, locales } from "@/components/i18n/i18n-navigation";

const isProtectedRoute = (pathname: string) => {
  const pattern =
    /^\/[a-z]{2}\/store\/((?!create$)(?!^$)(?!create\/success$).*)$/;
  return pattern.test(pathname);
};

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix,
});

const storeMiddleware = async (req: NextRequest) => {
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

const authMiddleware = withAuth(
  async (req, res) => {
    const storeId = req.nextUrl.pathname.split("/")[3];

    const jwt = req.nextauth.token;
    const locale =
      req.nextUrl.pathname.match(/(\/.*)\/store\/?.*/)?.at(1) ?? "";

    function rewrite(url: string) {
      const urlObj = new URL(url, req.url);
      return NextResponse.rewrite(urlObj);
    }

    if (!jwt) {
      return rewrite(getAuthPageUrl({ callbackUrl: `/${locale}/store` }));
    }

    try {
      const isAllowed = await authenticated(jwt.accessToken, storeCanManage, {
        storeId,
      });

      if (!isAllowed) {
        return rewrite(getErrorPageUrl({ error: "AccessDenied" }));
      }
    } catch (error: any) {
      if (isRedirectError(error)) {
        return rewrite(getAuthPageUrl({ callbackUrl: `/${locale}/store` }));
      }
    }
    return storeMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export function middleware(req: NextRequest, res: NextFetchEvent) {
  if (isProtectedRoute(req.nextUrl.pathname)) {
    return (authMiddleware as any)(req);
  }
  return storeMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ru|en)/:path*"],
};
