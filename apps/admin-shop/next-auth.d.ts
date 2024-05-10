// eslint-disable-next-line no-unused-vars
// eslint-disable-next-lint prettier/prettier
// noinspection ES6UnusedImports
import NextAuth, { NextAuthOptions } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      photoUrl: string;
      email: string;
      role: string;

      accessToken?: string;
    };
  }

  interface User {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    accessToken?: string;
    photoUrl?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string;
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
  }
}
