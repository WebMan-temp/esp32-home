"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignIn(){
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (session && status === "authenticated") {
      router.push("/");
    }
  }, [session, status, router]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Loading...</h1>
        </div>
      </main>
    );
  }

  // If already authenticated, don't show signin form
  if (session) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 space-y-4">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm opacity-80">Use your GitHub account to continue.</p>
          <Button 
            onClick={() => signIn("github")} 
            className="w-full"
          >
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}