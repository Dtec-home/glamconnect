import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { TopNav } from "@/components/navigation/top-nav";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wacu Marketplace",
  description: "Service provider marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <QueryProvider>
          <div className="flex min-h-screen flex-col pb-16 md:pb-0">
            <TopNav />
            <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-10">
              {children}
            </main>
            <BottomNav />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
