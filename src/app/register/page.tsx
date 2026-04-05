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
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["provider", "client"]),
});

type FormValues = z.infer<typeof schema>;

import { UserPlus, Mail, Lock, User, Briefcase, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <div className="flex w-full items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <UserPlus className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
          <p className="mt-2 text-muted-foreground font-medium">Join GlamKonnect and elevate your professional network.</p>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/50 p-8 shadow-xl backdrop-blur-sm sm:p-10">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="username"
                  className="pl-10 h-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all font-medium"
                  placeholder="johndoe"
                  {...register("username")}
                />
              </div>
              {errors.username && <p className="px-1 text-[10px] font-bold text-red-500 uppercase">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="email"
                  type="email"
                  className="pl-10 h-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all font-medium"
                  placeholder="john@example.com"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="px-1 text-[10px] font-bold text-red-500 uppercase">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  type="password"
                  className="pl-10 h-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all font-medium"
                  placeholder="••••••••"
                  {...register("password")}
                />
              </div>
              {errors.password && <p className="px-1 text-[10px] font-bold text-red-500 uppercase">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1" htmlFor="role">
                I want to be a...
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <select
                  id="role"
                  className="w-full pl-10 pr-4 h-12 rounded-xl border border-border/50 bg-background/50 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none appearance-none transition-all"
                  {...register("role")}
                >
                  <option value="client">Client (Hiring Services)</option>
                  <option value="provider">Provider (Professional)</option>
                </select>
              </div>
              {errors.role && <p className="px-1 text-[10px] font-bold text-red-500 uppercase">{errors.role.message}</p>}
            </div>

            {authMutation.error && (
              <div className="rounded-xl bg-red-500/10 p-3 text-center text-[10px] font-bold text-red-500 uppercase border border-red-500/20">
                Registration failed. Try a different username/email.
              </div>
            )}

            <Button
              type="submit"
              disabled={authMutation.isPending}
              className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 tracking-wide text-sm mt-4"
            >
              {authMutation.isPending ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs font-medium text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
           <div className="flex items-center gap-1.5"><ShieldCheck size={12} /> SECURE SSL</div>
           <div className="flex items-center gap-1.5"><Lock size={12} /> DATACENTER ENCRYPTION</div>
        </div>
      </motion.div>
    </div>
  );
}
