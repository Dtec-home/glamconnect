import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Discover trusted providers",
    description: "Browse verified beauty and home service experts near you.",
  },
  {
    title: "Book in minutes",
    description: "Choose a service, pick a time, and send your booking request instantly.",
  },
  {
    title: "Rate and review",
    description: "Share feedback after each completed booking to build community trust.",
  },
];

export default function Home() {
  return (
    <section className="flex w-full flex-col gap-10">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 text-left">
          <p className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Wacu Marketplace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Find and book top local service providers.
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            From makeup artists to home cleaning pros, Wacu helps clients connect with trusted
            providers and manage bookings in one simple platform.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/providers">Explore providers</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>For clients and providers</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Clients</h3>
            <p className="text-sm text-muted-foreground">
              Discover services, compare profiles, and manage booking requests from one dashboard.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Providers</h3>
            <p className="text-sm text-muted-foreground">
              Create services, upload portfolio images, and grow your visibility with verified
              reviews.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
