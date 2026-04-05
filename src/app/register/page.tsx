"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { register as registerUser } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/auth-token";

const schema = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["provider", "client"]),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "client",
    },
  });

  const authMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (payload) => {
      setAuthToken(payload.token);
      router.push("/dashboard");
    },
  });

  const onSubmit = (values: FormValues) => {
    authMutation.mutate(values);
  };

  return (
    <section
      suppressHydrationWarning
      className="mx-auto w-full max-w-md rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900"
    >
      <h1 className="text-xl font-semibold">Register</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Create your provider or client account.
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
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border px-3 py-2 text-sm"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-red-600">{errors.email.message}</p>
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

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            className="w-full rounded-md border px-3 py-2 text-sm"
            {...register("role")}
          >
            <option value="client">Client</option>
            <option value="provider">Provider</option>
          </select>
          {errors.role ? (
            <p className="text-xs text-red-600">{errors.role.message}</p>
          ) : null}
        </div>

        {authMutation.error ? (
          <p className="text-xs text-red-600">Unable to register.</p>
        ) : null}

        <button
          type="submit"
          disabled={authMutation.isPending}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {authMutation.isPending ? "Creating account..." : "Create account"}
        </button>
      </form>
    </section>
  );
}
