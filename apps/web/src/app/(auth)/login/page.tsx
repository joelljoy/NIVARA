"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Metadata } from "next";

const schema = z.object({
  email:      z.string().email("Enter a valid email"),
  password:   z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
    } catch (err: any) {
      // handled by interceptor
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your NIVARA account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="login-form">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          required
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          required
          {...register("password")}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-border text-primary focus:ring-primary"
              {...register("rememberMe")}
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-primary font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full mt-2"
          loading={isSubmitting}
          id="login-submit-btn"
        >
          Sign In
        </Button>

        {/* Demo credentials */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs space-y-1">
          <p className="font-semibold text-blue-700">Demo credentials</p>
          <p className="text-blue-600">Patient: patient@demo.com / demo1234</p>
          <p className="text-blue-600">Doctor: doctor@demo.com / demo1234</p>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
