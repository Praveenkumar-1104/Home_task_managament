"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/common/navItems";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1.5">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={isActive ? "nav-link-active" : "nav-link"}>
            <span className={item.color}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
