import Link from "next/link";

export function TopNav() {
  return (
    <header className="hidden border-b bg-white md:block dark:bg-zinc-950">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="text-sm font-semibold tracking-wide">Wacu Marketplace</div>
        <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300">
          <Link href="/" className="rounded px-2 py-1 hover:text-zinc-900 dark:hover:text-zinc-100">
            Home
          </Link>
          <Link
            href="/providers"
            className="rounded px-2 py-1 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Providers
          </Link>
          <Link
            href="/bookings"
            className="rounded px-2 py-1 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Bookings
          </Link>
          <Link
            href="/profile"
            className="rounded px-2 py-1 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Profile
          </Link>
          <Link
            href="/login"
            className="rounded px-2 py-1 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded px-2 py-1 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
