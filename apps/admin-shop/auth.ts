import { APIFunction, signInAdmin, signOutAdmin, UserRole } from "@ditch/lib";
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
      return user.role === UserRole.ADMIN;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.accessToken = user.accessToken as string;
        token.photoUrl = user.photoUrl;
      }
      return token;
    },

    async session({ session, user, token }) {
      session.user.id = token.id as string;
      session.user.name = `${token.firstName} ${token.lastName}`;
      session.user.role = token.role as string;
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
};
