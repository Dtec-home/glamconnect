"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/auth-token";

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const authMutation = useMutation({
    mutationFn: login,
    onSuccess: (payload) => {
      setAuthToken(payload.token);
      if (payload.user.is_provider) {
        router.push("/dashboard");
        return;
      }
      router.push("/");
    },
  });

  const onSubmit = (values: FormValues) => {
    authMutation.mutate(values);
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
      <h1 className="text-xl font-semibold">Login</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Sign in as provider or client.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="w-full rounded-md border px-3 py-2 text-sm"
            {...register("username")}
          />
          {errors.username ? (
            <p className="text-xs text-red-600">{errors.username.message}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border px-3 py-2 text-sm"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        {authMutation.error ? (
          <p className="text-xs text-red-600">Unable to sign in.</p>
        ) : null}

        <button
          type="submit"
          disabled={authMutation.isPending}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {authMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
