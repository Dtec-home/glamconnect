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

import Image from "next/image";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Experts", href: "/providers", icon: Search },
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
    <aside className="sticky top-0 h-screen flex w-16 flex-col border-r border-border/50 bg-card/60 backdrop-blur-xl sm:w-64 font-geist-sans transition-all">
      <div className="flex h-16 items-center px-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
          <div className="relative size-9 overflow-hidden rounded-xl border border-primary/20 shadow-md transition-all group-hover:shadow-primary/20">
            <Image 
              src="/branding/logo.png" 
              alt="GlamKonnect Logo" 
              fill 
              className="object-cover"
              sizes="36px"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-tighter uppercase text-foreground">GlamKonnect</h1>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-foreground/60 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} className="flex-shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
              {active && (
                <div className="ml-auto hidden sm:block size-1.5 rounded-full bg-primary-foreground/50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/50">
        {meQuery.data ? (
          <div className="space-y-3">
            <div className="hidden sm:flex items-center gap-3 px-3">
              <div className="size-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground uppercase">
                {meQuery.data.username.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold">{meQuery.data.username}</p>
                <p className="text-[10px] text-foreground/50 uppercase tracking-wider font-semibold">
                  {meQuery.data.is_provider ? "Provider" : "Client"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
              onClick={onLogout}
            >
              <LogOut size={16} className="sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="hidden sm:block px-3">
              <p className="text-xs font-semibold text-foreground/50">Not logged in</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full rounded-xl">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="w-full rounded-xl">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
