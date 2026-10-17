"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const tabs = [
  { href: "/", label: "Главная", icon: "home" },
  { href: "/analytics", label: "Аналитика", icon: "chart" },
  { href: "/settings", label: "Настройки", icon: "settings" },
] as const;

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-md items-stretch pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted"
              }`}
            >
              <Icon name={tab.icon} className="h-6 w-6" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
