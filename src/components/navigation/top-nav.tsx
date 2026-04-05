import Link from "next/link";

export function TopNav() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
        <div className="text-sm font-semibold tracking-wide">Wacu Marketplace</div>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-foreground/70 sm:gap-4">
          <Link href="/" className="rounded px-2 py-1 hover:text-foreground">
            Home
          </Link>
          <Link
            href="/providers"
            className="rounded px-2 py-1 hover:text-foreground"
          >
            Providers
          </Link>
          <Link
            href="/bookings"
            className="rounded px-2 py-1 hover:text-foreground"
          >
            Bookings
          </Link>
          <Link
            href="/profile"
            className="rounded px-2 py-1 hover:text-foreground"
          >
            Profile
          </Link>
          <Link
            href="/login"
            className="rounded px-2 py-1 hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded px-2 py-1 hover:text-foreground"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
