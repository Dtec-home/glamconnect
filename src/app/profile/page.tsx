"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { getMe } from "@/lib/api/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  return (
    <section className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your current session and account role.</CardDescription>
        </CardHeader>
        <CardContent>
          {meQuery.isLoading ? <p className="text-sm">Loading...</p> : null}
          {!meQuery.isLoading && !meQuery.data ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              You are not logged in. <Link href="/login" className="underline">Login</Link>
            </p>
          ) : null}

          {meQuery.data ? (
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Username:</span> {meQuery.data.username}
              </p>
              <p>
                <span className="font-medium">Email:</span> {meQuery.data.email}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                {meQuery.data.is_provider ? "Provider" : "Client"}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
