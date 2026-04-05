"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Filter } from "lucide-react";

import { VerificationBadge } from "@/components/providers/verification-badge";
import { getProviders } from "@/lib/api/marketplace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProvidersPage() {
  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: getProviders,
  });

  return (
    <div className="flex w-full flex-col gap-10 pb-10">
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm sm:p-10">
         <div className="max-w-2xl">
           <h1 className="text-3xl font-bold tracking-tight mb-2">Find Professionals</h1>
           <p className="text-muted-foreground mb-8">Browse and connect with verified service providers in your area.</p>
           
           <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
               <Input placeholder="Search services or providers..." className="pl-10 h-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20" />
             </div>
             <Button className="h-12 rounded-xl px-8 font-bold shadow-lg shadow-primary/20">Search</Button>
             <Button variant="outline" className="h-12 rounded-xl px-4 border-border/50"><Filter size={18} /></Button>
           </div>
         </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold">Featured Providers</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{providersQuery.data?.length ?? 0} Results</p>
        </div>

        {providersQuery.isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl border border-border/20 bg-muted animate-pulse" />
            ))}
          </div>
        )}
        
        {providersQuery.isError && (
          <div className="rounded-2xl border border-dashed border-border/50 p-12 text-center">
            <p className="text-muted-foreground font-medium">Unable to load providers at this time.</p>
            <Button variant="link" onClick={() => providersQuery.refetch()} className="mt-2 font-bold uppercase tracking-wider text-xs">Try Again</Button>
          </div>
        )}

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {providersQuery.data?.map((provider) => (
            <motion.li
              key={provider.id}
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
              className="group relative flex flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="size-14 rounded-2xl bg-muted flex items-center justify-center text-primary/50 text-xl font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {provider.user.username[0].toUpperCase()}
                </div>
                {provider.is_verified && <VerificationBadge />}
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{provider.user.username}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={12} className="text-primary/70" />
                  {provider.location || "Location not set"}
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 bg-muted/30 p-3 rounded-xl border border-border/20">
                {provider.bio || "This professional hasn't added a bio yet."}
              </p>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-primary-600 font-bold text-[10px] uppercase tracking-tighter bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                  <Star size={10} fill="currentColor" /> Verified Expert
                </div>
                <a
                  href={`/providers/${provider.id}`}
                  className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1 group/link"
                >
                  View Profile 
                  <motion.span animate={{ x: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                </a>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
