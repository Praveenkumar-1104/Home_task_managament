import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Sidebar from "@/components/common/Sidebar";
import MobileNav from "@/components/common/MobileNav";

export const metadata: Metadata = {
  title: "Home Task Manager",
  description: "A shared household task manager built with Next.js and Supabase.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container py-4">
          <MobileNav />
          <div className="row">
            <aside className="col-md-3 mb-4 d-none d-md-block">
              <Sidebar />
            </aside>
            <div className="col-md-9">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
