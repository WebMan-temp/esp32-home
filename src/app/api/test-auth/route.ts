import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      authenticated: !!session,
      session: session ? {
        user: session.user,
        expires: session.expires
      } : null,
      env: {
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        hasGitHubId: !!process.env.GITHUB_ID,
        hasGitHubSecret: !!process.env.GITHUB_SECRET,
        nextauthUrl: process.env.NEXTAUTH_URL
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      authenticated: false
    }, { status: 500 });
  }
}
