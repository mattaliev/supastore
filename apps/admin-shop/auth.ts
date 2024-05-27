import { APIFunction, signInAdmin, signOutAdmin } from "@ditch/lib";
import { redirect } from "next/navigation";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authenticated = async <T, U>(
  accessToken: string,
  fn: APIFunction<T, U>,
  body: T,
): Promise<U | undefined> => {
  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    const response = await fn(body, headers);
    return response;
  } catch (error: any) {
    if (error.errorCode === 401) {
      redirect("/auth/signIn");
    }

    if (error.errorCode === 403) {
      redirect("/auth/error?error=AccessDenied");
    }
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "telegram",
      name: "telegram",
      credentials: {},
      async authorize(credentials, req) {
        const authResponse = await signInAdmin({
          dataCheckString: new URLSearchParams(req.query).toString(),
        });

        if (!authResponse) {
          return null;
        }

        const { user, accessToken } = authResponse;

        if (user) {
          return {
            ...user,
            accessToken,
          } as User;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.accessToken = user.accessToken as string;
        token.photoUrl = user.photoUrl;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, user, token }) {
      session.user.id = token.id as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.username = token.username as string;
      session.user.accessToken = token.accessToken as string;
      session.user.photoUrl = token.photoUrl as string;
      return session;
    },
  },
  events: {
    async signOut({ session, token }) {
      await authenticated(token.accessToken, signOutAdmin, {
        token: token.accessToken,
      });
    },
  },
  pages: {
    signIn: "/auth/signIn",
    error: "/auth/error",
  },
  session: {
    /**
     * Next auth session is always being kept alive, meaning it does not
     * have a fixed expiration time. This not true for the access token issued
     * by the API. The access token expires after 24 hours. To avoid the situation
     * where the user is logged in but the access token is expired, we set the
     * maxAge to 4 hours. This means that the user will be logged out after 4 hours
     * of inactivity.
     */
    maxAge: 60 * 60 * 4, // 4 hours
  },
};
