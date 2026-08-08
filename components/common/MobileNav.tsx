"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/common/navItems";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-link ${isActive ? "bottom-nav-link-active" : ""}`}
          >
            <span className={isActive ? undefined : item.color}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
