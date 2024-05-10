import { withAuth } from "next-auth/middleware";

export default withAuth(
  async (req, res) => {
    console.log(req.nextUrl.pathname);
    /**
     * This logic should be added in the future
     *
     * const userId = req.nextauth.token?.id;
     * const path = req.nextUrl.pathname.split("/");
     * const storeIndex = path.findIndex((p) => p === "store") + 1;
     * const storeId = path[storeIndex];
     *
     * const hasAdminAccessToStore = await canAccessStore(userId, storeId);
     *
     * if (!hasAdminAccessToStore) {
     *    return NextResponse.rewrite("/auth/error?error=AccessDenied");
     * }
     */
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "ADMIN",
    },
  },
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/signIn|auth/error).*)",
  ],
};
