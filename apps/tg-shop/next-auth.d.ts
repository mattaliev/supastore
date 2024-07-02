// eslint-disable-next-line no-unused-vars
// eslint-disable-next-lint prettier/prettier
// noinspection ES6UnusedImports
import NextAuth, { NextAuthOptions } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      photoUrl: string;
      username: string;
      languageCode: string;
      initDataRaw: string;
    };
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    languageCode: string;
    photoUrl?: string;
    username?: string;
    initDataRaw: string;
    storeId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    initDataRaw: string;
    id: string;
    username?: string;
    firstName: string;
    languageCode: string;
    lastName: string;
    photoUrl?: string;
  }
}
