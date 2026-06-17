"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

const schema = z.object({ email: z.string().email("Enter a valid email address") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }: FormData) => {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch { /* Always show success to prevent email enumeration */ }
    setSentEmail(email);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="animate-slide-up text-center">
        <div className="h-16 w-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
        <p className="text-muted-foreground text-sm mb-1">We sent a password reset link to:</p>
        <p className="font-semibold text-foreground mb-6">{sentEmail}</p>
        <p className="text-xs text-muted-foreground mb-8">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button onClick={() => setSent(false)} className="text-primary hover:underline">try again</button>.
        </p>
        <Link href="/login">
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="forgot-password-form">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          required
          {...register("email")}
        />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}
