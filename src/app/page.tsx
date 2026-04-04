export default function Home() {
  return (
    <section className="flex w-full flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Service Provider Marketplace
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 md:text-base">
          Foundation sprint is active. Authentication, profiles, and booking flows
          will be layered on this shell.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border bg-white p-5 shadow-sm dark:bg-zinc-900">
          <h2 className="text-sm font-semibold">Backend</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Django project created with custom user model and GraphQL endpoint.
          </p>
        </article>

        <article className="rounded-xl border bg-white p-5 shadow-sm dark:bg-zinc-900">
          <h2 className="text-sm font-semibold">Frontend</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Next.js App Router shell with desktop and mobile navigation layout.
          </p>
        </article>

        <article className="rounded-xl border bg-white p-5 shadow-sm dark:bg-zinc-900">
          <h2 className="text-sm font-semibold">Data Layer</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            React Query provider and GraphQL client scaffolded for upcoming features.
          </p>
        </article>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm dark:bg-zinc-900">
        <h2 className="text-sm font-semibold">Next Sprint Preview</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
          <li>Registration and login mutations</li>
          <li>Provider and client profile models</li>
          <li>Role-based route guarding</li>
        </ul>
      </div>
    </section>
  );
}
