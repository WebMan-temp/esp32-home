import { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: { 
    signIn: "/signin",
  },
  callbacks: {
    async redirect({ baseUrl }) {
      // After OAuth, always redirect to home page
      return `${baseUrl}/`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
