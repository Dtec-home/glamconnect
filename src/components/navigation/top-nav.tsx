import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 font-geist-sans">
        <Link href="/" className="flex items-center gap-2.5 transition-all hover:opacity-80 active:scale-95">
          <div className="relative size-9 overflow-hidden rounded-xl border border-primary/20 shadow-sm">
            <Image 
              src="/branding/logo.png" 
              alt="GlamKonnect Logo" 
              fill 
              className="object-cover"
              sizes="36px"
              priority
            />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-foreground">GlamKonnect</span>
        </Link>
        
        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild size="sm" className="text-xs font-bold uppercase tracking-widest text-foreground/70 hover:text-primary">
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="text-xs font-bold uppercase tracking-widest text-foreground/70 hover:text-primary">
            <Link href="/providers">Experts</Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="text-xs font-bold uppercase tracking-widest text-foreground/70 hover:text-primary">
            <Link href="/bookings">Bookings</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild size="sm" className="hidden text-xs font-bold uppercase tracking-widest sm:flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full px-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:shadow-xl active:scale-95">
            <Link href="/register">Join GlamKonnect</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
