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
    async redirect({ url, baseUrl }) {
      // If user is already authenticated and trying to access signin, redirect to home
      if (url.includes("callbackUrl") && url.includes("signin")) {
        return `${baseUrl}/`;
      }
      
      // If there's a callbackUrl, use it
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // If it's the same origin, allow it
      if (new URL(url).origin === baseUrl) return url;
      
      // Default to home page
      return `${baseUrl}/`;
    },
    async session({ session }) {
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
