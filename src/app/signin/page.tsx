"use client";
import { signIn } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignIn(){
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