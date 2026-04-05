import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50"
      >
        <QueryProvider>
          <div className="flex min-h-screen">
            <AppSidebar />

            <div className="flex flex-1 flex-col pb-16 sm:pb-0">
              <header className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950 sm:hidden">
                <p className="text-sm font-semibold tracking-wide">Wacu Marketplace</p>
              </header>

              <main className="flex w-full flex-1 px-4 py-6 sm:px-8 sm:py-8">
                {children}
              </main>
              <BottomNav />
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
