import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Sidebar from "@/components/common/Sidebar";
import MobileNav from "@/components/common/MobileNav";
import NotificationBell from "@/components/notifications/NotificationBell";
import { NotificationProvider } from "@/context/NotificationContext";

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
    <html lang="en">
      <body>
        <NotificationProvider userId={currentMemberId}>
          <div className="container py-4">
            <div className="flex items-center justify-between gap-4 pb-4 md:hidden">
              <MobileNav />
              <NotificationBell />
            </div>
            <div className="row">
              <aside className="col-md-3 mb-4 d-none d-md-block">
                <div className="sticky top-4 space-y-4">
                  <Sidebar />
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <NotificationBell />
                  </div>
                </div>
              </aside>
              <div className="col-md-9">{children}</div>
            </div>
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}
