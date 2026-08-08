import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Home Task Manager",
  description: "A shared household task manager built with Next.js and Supabase.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const currentMemberId = process.env.NEXT_PUBLIC_CURRENT_MEMBER_ID ?? "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <NotificationProvider userId={currentMemberId}>{children}</NotificationProvider>
      </body>
    </html>
  );
}
