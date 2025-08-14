"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function SP({ children, session }: { children: React.ReactNode; session?: Session | null }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}