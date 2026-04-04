import { CalendarCheck, Home, Search, UserRound } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Discover", href: "/providers", icon: Search },
  { label: "Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur md:hidden dark:bg-zinc-950/95">
      <ul className="mx-auto grid h-16 max-w-2xl grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.label}>
              <a
                href={item.href}
                className="flex h-full flex-col items-center justify-center gap-1 text-[11px] text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
