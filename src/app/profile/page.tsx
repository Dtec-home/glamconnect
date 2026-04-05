"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { getMe } from "@/lib/api/auth";
import { User2, Mail, Shield, LogOut, Settings, Bell, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const user = meQuery.data;

  return (
    <div className="flex w-full flex-col gap-10 pb-10">
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="size-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <User2 size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{user?.username ?? "User Profile"}</h1>
              <p className="text-muted-foreground">{user?.email ?? "Manage your account settings"}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {user?.is_provider ? "Service Provider" : "Client"}
              </div>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl gap-2 font-bold text-xs uppercase tracking-wider">
            <Settings size={14} /> Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-4">
           {[
             { label: "Account", icon: <User2 size={18} />, active: true },
             { label: "Security", icon: <Shield size={18} /> },
             { label: "Notifications", icon: <Bell size={18} /> },
             { label: "Payments", icon: <CreditCard size={18} /> },
           ].map((nav) => (
             <button key={nav.label} className={`flex w-full items-center gap-3 rounded-xl p-3 text-sm font-bold transition-all ${nav.active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
               {nav.icon} {nav.label}
             </button>
           ))}
           <div className="pt-4 mt-4 border-t border-border/50">
             <button className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all">
               <LogOut size={18} /> Logout Session
             </button>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold mb-6">Account Details</h2>
            {meQuery.isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ) : !user ? (
               <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-center">
                 <p className="text-sm font-medium text-red-600">You are not logged in.</p>
                 <Link href="/login" className="mt-2 inline-block text-xs font-bold uppercase tracking-wider underline underline-offset-4">Go to Login</Link>
               </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><User2 size={10} /> Username</p>
                  <p className="font-bold text-lg">{user.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Mail size={10} /> Email Address</p>
                  <p className="font-bold text-lg">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Shield size={10} /> Account Role</p>
                  <p className="font-bold text-lg">{user.is_provider ? "Professional Provider" : "Verified Client"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account Status</p>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm border-dashed">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">Two-Factor Authentication</h3>
                <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account.</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-lg h-8 text-[10px] uppercase font-bold tracking-wider">Enable</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
