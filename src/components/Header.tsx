"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header(){
  const { data: session, status } = useSession();
  return (
    <header className="w-full flex items-center justify-between py-3">
      <div className="font-semibold">ESP32 Home Control</div>
      <div>
        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            <span className="text-sm opacity-80">{session?.user?.name || session?.user?.email}</span>
            <Button variant="secondary" onClick={()=>signOut({ callbackUrl: "/signin" })}>Sign out</Button>
          </div>
        ) : (
          <Button onClick={()=>signIn()}>Sign in</Button>
        )}
      </div>
    </header>
  );
}