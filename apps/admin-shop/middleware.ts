import { storeCanManage } from "@ditch/lib";
import { isRedirectError } from "next/dist/client/components/redirect";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import { authenticated } from "@/auth";

export default withAuth(
  async (req, res) => {
    const storeId = req.nextUrl.pathname.split("/")[2];

    const jwt = req.nextauth.token;
    if (!jwt) {
      return NextResponse.rewrite(
        new URL(
          `/auth/signIn?callbackUrl=${encodeURIComponent("/store")}`,
          req.url,
        ),
      );
    }

    try {
      const isAllowed = await authenticated(jwt.accessToken, storeCanManage, {
        storeId,
      });

      if (!isAllowed) {
        return NextResponse.rewrite(
          new URL("/auth/error?error=AccessDenied", req.url),
        );
      }
    } catch (error: any) {
      if (isRedirectError(error)) {
        return NextResponse.rewrite(
          new URL(
            `/auth/signIn?callbackUrl=${encodeURIComponent("/store")}`,
            req.url,
          ),
        );
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

// export const config = {
//   matcher: ["/store/:path((?!^$|^create$).*)"],
// };

export const config = {
  matcher: ["/store/:path((?!create$)(?!^$)(?!create/success$).*)"],
};
