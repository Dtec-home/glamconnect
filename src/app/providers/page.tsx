"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { VerificationBadge } from "@/components/providers/verification-badge";
import { getProviders } from "@/lib/api/marketplace";

export default function ProvidersPage() {
  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: getProviders,
  });

  return (
    <section className="w-full rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
      <h1 className="text-xl font-semibold">Providers</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Browse available providers.</p>

      {providersQuery.isLoading ? <p className="mt-4 text-sm">Loading providers...</p> : null}
      {providersQuery.isError ? (
        <p className="mt-4 text-sm text-red-600">Unable to load providers.</p>
      ) : null}

      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="mt-5 grid gap-4 md:grid-cols-2"
      >
        {providersQuery.data?.map((provider) => (
          <motion.li
            key={provider.id}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            className="rounded-xl border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{provider.user.username}</p>
                <p className="text-xs text-zinc-500">{provider.location || "Location not set"}</p>
              </div>
              {provider.is_verified ? <VerificationBadge /> : null}
            </div>

            <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
              {provider.bio || "No bio yet."}
            </p>

            <a
              href={`/providers/${provider.id}`}
              className="mt-4 inline-block text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
            >
              View profile
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
