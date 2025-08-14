import "./globals.css";
import SP from "@/components/SessionProvider";
import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function RootLayout({ children }: { children: React.ReactNode }){
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className="min-h-screen max-w-3xl mx-auto px-4">
        <SP session={session}>
          <Header />
          {children}
        </SP>
      </body>
    </html>
  );
}