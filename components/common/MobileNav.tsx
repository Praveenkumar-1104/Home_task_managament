"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/boards", label: "Boards" },
  { href: "/members", label: "Members" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="d-md-none mb-3">
      <div className="d-flex overflow-auto gap-2 pb-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`btn btn-sm flex-shrink-0 ${
              pathname?.startsWith(item.href) ? "btn-primary" : "btn-outline-secondary"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
