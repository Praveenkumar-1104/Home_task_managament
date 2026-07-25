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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">Workspace</h5>
        <div className="list-group list-group-flush">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`list-group-item list-group-item-action ${
                pathname?.startsWith(item.href) ? "active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
