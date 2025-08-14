import "./globals.css";
import SP from "@/components/SessionProvider";
import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Metadata, Viewport } from "next";
import SWRegister from "@/components/SWRegister";

export const metadata: Metadata = {
  title: "ESP32 Home Control",
  description: "Control your ESP32 home automation system",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ESP32 Home",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default async function RootLayout({ children }: { children: React.ReactNode }){
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ESP32 Home" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="min-h-screen max-w-3xl mx-auto px-4">
        <SP session={session}>
          <Header />
          {children}
        </SP>
        <SWRegister />
      </body>
    </html>
  );
}