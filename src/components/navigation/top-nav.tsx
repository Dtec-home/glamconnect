export function TopNav() {
  return (
    <header className="hidden border-b bg-white md:block dark:bg-zinc-950">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="text-sm font-semibold tracking-wide">Wacu Marketplace</div>
        <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300">
          <a href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Home
          </a>
          <a href="/providers" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Providers
          </a>
          <a href="/bookings" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Bookings
          </a>
          <a href="/profile" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Profile
          </a>
        </nav>
      </div>
    </header>
  );
}
