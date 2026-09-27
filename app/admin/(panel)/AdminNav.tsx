"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "امروز" },
  { href: "/admin/week", label: "هفته" },
  { href: "/admin/new", label: "نوبت جدید" },
  { href: "/admin/block", label: "بستن زمان" },
  { href: "/admin/search", label: "جستجو" },
  { href: "/admin/settings", label: "تنظیمات" },
  { href: "/admin/log", label: "تاریخچه" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="بخش‌های پنل" className="overflow-x-auto">
      <ul className="flex gap-1 px-2 pb-2">
        {items.map((it) => {
          const active = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 items-center rounded-pill px-4 text-sm whitespace-nowrap no-underline ${
                  active ? "bg-primary text-white hover:text-white" : "text-ink hover:bg-tint"
                }`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
