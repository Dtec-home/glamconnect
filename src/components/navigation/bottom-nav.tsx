"use client";

import { CalendarCheck, Home, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/lib/api/auth";
import { getAuthToken } from "@/lib/auth-token";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Discover", href: "/providers", icon: Search },
  { label: "Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  const token = getAuthToken();
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
  });

  if (!token || !meQuery.data) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/80 backdrop-blur-md sm:hidden">
      <ul className="mx-auto grid h-16 max-w-2xl grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-label={item.label}
                className={`group flex h-full flex-col items-center justify-center gap-1 px-1 transition-all ${
                  active
                    ? "text-primary"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                <div className={`relative flex items-center justify-center transition-transform group-active:scale-90 ${active ? "scale-110" : ""}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  {active && (
                    <span className="absolute -inset-2 rounded-full bg-primary/10 -z-10 animate-in fade-in zoom-in duration-300" />
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${active ? "text-primary" : ""}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
