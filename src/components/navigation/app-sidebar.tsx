"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Home,
  LayoutDashboard,
  LogOut,
  Search,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getMe } from "@/lib/api/auth";
import { clearAuthToken } from "@/lib/auth-token";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Discover", href: "/providers", icon: Search },
  { label: "Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const onLogout = async () => {
    clearAuthToken();
    await queryClient.invalidateQueries({ queryKey: ["me"] });
    router.push("/login");
  };

  return (
    <aside className="flex w-16 flex-col border-r border-border bg-card sm:w-56">
      <div className="hidden space-y-2 border-b border-border p-3 sm:block">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Wacu</p>
        <h1 className="text-sm font-bold">Marketplace</h1>
      </div>

      <nav className="flex-1 space-y-1 p-2 sm:p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-2 py-2 text-xs transition-colors sm:text-sm ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/60 hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden space-y-2 border-t border-border p-3 sm:block">
        {meQuery.data ? (
          <>
            <p className="truncate text-xs font-semibold">{meQuery.data.username}</p>
            <p className="text-xs text-foreground/60">
              {meQuery.data.is_provider ? "Provider" : "Client"}
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="mt-2 w-full"
              onClick={onLogout}
            >
              <LogOut size={14} />
              Logout
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold">Not logged in</p>
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 text-xs">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
