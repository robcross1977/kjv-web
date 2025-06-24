import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import type { NextAuthConfig } from "next-auth";

export const config = {
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_DOMAIN!,
      wellKnown: `${process.env.AUTH0_DOMAIN}/.well-known/openid_configuration`,
    }),
  ],
  callbacks: {
    session({ session, token }) {
      // Ensure the user ID is available in the session
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token, account, profile }) {
      // Persist the OAuth account info and profile info to the token
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  debug: process.env.NODE_ENV === "development",
  // Remove custom pages to use NextAuth.js defaults
  // pages: {
  //   signIn: "/auth/signin",
  //   error: "/auth/error",
  // },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
