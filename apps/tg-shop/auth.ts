import { Cart, cartGet, cartGetByUserId, signInShopUser } from "@ditch/lib";
import { cookies } from "next/headers";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { tmaAuthenticated } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "telegram",
      name: "telegram",
      credentials: {
        storeId: { label: "Store ID", type: "text" },
        initDataRaw: { label: "Init Data Raw", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const { storeId, initDataRaw } = credentials;

        const authResponse = await signInShopUser({
          storeId,
          initDataRaw,
        });

        return {
          ...authResponse.user,
          initDataRaw,
          storeId,
        } as User;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user) {
        return false;
      }

      const cartId = cookies().get("cartId")?.value;

      let cart: Cart | undefined;

      if (cartId) {
        cart = await cartGet({ cartId, storeId: user.storeId });
      }

      if (!cart) {
        cart = await tmaAuthenticated(
          user.initDataRaw,
          user.storeId,
          cartGetByUserId,
          {
            storeId: user.storeId,
          },
        );
      }

      if (cart) {
        cookies().set("cartId", cart.id);
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.initDataRaw = user.initDataRaw as string;
        token.photoUrl = user.photoUrl;
        token.username = user.username;
        token.languageCode = user.languageCode;
      }
      return token;
    },

    async session({ session, user, token }) {
      session.user.id = token.id as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.username = token.username as string;
      session.user.photoUrl = token.photoUrl as string;
      session.user.languageCode = token.languageCode as string;
      session.user.initDataRaw = token.initDataRaw as string;
      return session;
    },
  },
  session: {
    /**
     * Next auth session is always being kept alive, meaning it does not
     * have a fixed expiration time. This is not true for the access token issued
     * by the API. The access token expires after 24 hours. To avoid the situation
     * where the user is logged in but the access token is expired, we set the
     * maxAge to 4 hours. This means that the user will be logged out after 4 hours
     * of inactivity.
     */
    maxAge: 60 * 60 * 4, // 4 hours
  },
};
