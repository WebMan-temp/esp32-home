"use client";
import { signIn, getSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignIn(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl);
      }
    });
  }, [router, callbackUrl]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("github", { 
        callbackUrl: callbackUrl,
        redirect: true 
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 space-y-4">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm opacity-80">Use your GitHub account to continue.</p>
          <Button 
            onClick={handleSignIn} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Signing in..." : "Continue with GitHub"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}