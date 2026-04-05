"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/lib/api/auth";
import { getAuthToken } from "@/lib/auth-token";

import { AppSidebar } from "./app-sidebar";
import { BottomNav } from "./bottom-nav";
import { TopNav } from "./top-nav";

type AppChromeProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppChrome({ children }: AppChromeProps) {
  const token = getAuthToken();
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });

  const isAuthenticated = Boolean(token && meQuery.data);

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen">
        <AppSidebar />

        <div className="flex flex-1 flex-col pb-16 sm:pb-0">
          <main className="flex w-full flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
          <BottomNav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}