"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User, Mail, Lock, Phone, Eye, EyeOff, ChevronRight, ChevronLeft,
  Stethoscope, Heart, Building2, Users, Shield, Settings,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const stepOneSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName:  z.string().min(2, "Last name must be at least 2 characters"),
  email:     z.string().email("Enter a valid email"),
  phone:     z.string().min(10, "Enter a valid 10-digit phone number"),
  dateOfBirth: z.string().optional(),
});

const stepTwoSchema = z.object({
  password:        z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type StepOneData = z.infer<typeof stepOneSchema>;
type StepTwoData = z.infer<typeof stepTwoSchema>;

const roles: { role: UserRole; label: string; description: string; icon: React.ReactNode }[] = [
  { role: "patient",            label: "Patient",          description: "Manage my own health records",           icon: <Heart className="h-5 w-5" /> },
  { role: "doctor",             label: "Doctor",           description: "Access and manage patient records",       icon: <Stethoscope className="h-5 w-5" /> },
  { role: "hospital_admin",     label: "Hospital Admin",   description: "Administer hospital health data",         icon: <Building2 className="h-5 w-5" /> },
  { role: "family_caregiver",   label: "Family Caregiver", description: "Manage family members' health",          icon: <Users className="h-5 w-5" /> },
  { role: "insurance_reviewer", label: "Insurance",        description: "Review medical records for claims",       icon: <Shield className="h-5 w-5" /> },
];

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [step, setStep] = useState(1);
  const [stepOneData, setStepOneData] = useState<StepOneData | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form1 = useForm<StepOneData>({ resolver: zodResolver(stepOneSchema) });
  const form2 = useForm<StepTwoData>({ resolver: zodResolver(stepTwoSchema) });

  const handleStepOne = (data: StepOneData) => {
    setStepOneData(data);
    setStep(2);
  };

  const handleStepTwo = async (data: StepTwoData) => {
    if (!stepOneData) return;
    try {
      await registerUser({ ...stepOneData, password: data.password, role: selectedRole });
    } catch { /* handled */ }
  };

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                step > s ? "bg-success text-white" : step === s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div className={cn("h-0.5 w-8 rounded transition-all duration-500", step > s ? "bg-success" : "bg-muted")} />}
            </div>
          ))}
          <span className="ml-2 text-xs text-muted-foreground">
            {step === 1 ? "Personal info" : step === 2 ? "Choose role" : "Set password"}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
        <p className="text-muted-foreground text-sm mt-1">Join NIVARA — secure health management for everyone</p>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <form onSubmit={form1.handleSubmit(handleStepOne)} className="space-y-4" id="register-step1">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" placeholder="Rahul" error={form1.formState.errors.firstName?.message}
              leftIcon={<User className="h-4 w-4" />} required {...form1.register("firstName")} />
            <Input label="Last name"  placeholder="Sharma" error={form1.formState.errors.lastName?.message}
              required {...form1.register("lastName")} />
          </div>
          <Input label="Email address" type="email" placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />} error={form1.formState.errors.email?.message}
            required {...form1.register("email")} />
          <Input label="Phone number" type="tel" placeholder="+91 98765 43210"
            leftIcon={<Phone className="h-4 w-4" />} error={form1.formState.errors.phone?.message}
            required {...form1.register("phone")} />
          <Input label="Date of birth" type="date" error={form1.formState.errors.dateOfBirth?.message}
            {...form1.register("dateOfBirth")} />
          <Button type="submit" size="lg" className="w-full" rightIcon={<ChevronRight className="h-4 w-4" />}>
            Continue
          </Button>
        </form>
      )}

      {/* Step 2: Role selection */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">I am registering as a:</p>
          <div className="space-y-2">
            {roles.map((r) => (
              <button
                key={r.role}
                id={`role-${r.role}`}
                onClick={() => setSelectedRole(r.role)}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-150",
                  selectedRole === r.role
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-white hover:border-primary/40 hover:bg-surface"
                )}
              >
                <div className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  selectedRole === r.role ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  {r.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.description}</p>
                </div>
                <div className={cn(
                  "h-4 w-4 rounded-full border-2 flex-shrink-0 transition-all",
                  selectedRole === r.role ? "border-primary bg-primary" : "border-border"
                )} />
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}
              leftIcon={<ChevronLeft className="h-4 w-4" />}>Back</Button>
            <Button size="lg" className="flex-1" onClick={() => setStep(3)}
              rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button>
          </div>
        </div>
      )}

      {/* Step 3: Password */}
      {step === 3 && (
        <form onSubmit={form2.handleSubmit(handleStepTwo)} className="space-y-4" id="register-step3">
          <Input label="Password" type={showPass ? "text" : "password"} placeholder="Min 8 characters"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={form2.formState.errors.password?.message} required {...form2.register("password")} />
          <Input label="Confirm password" type={showConfirm ? "text" : "password"} placeholder="Repeat password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={form2.formState.errors.confirmPassword?.message} required {...form2.register("confirmPassword")} />
          <div className="text-xs text-muted-foreground bg-surface rounded-xl p-3">
            <p className="font-medium text-foreground mb-1">Password requirements:</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li>At least 8 characters</li>
              <li>Mix of letters and numbers recommended</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}
              leftIcon={<ChevronLeft className="h-4 w-4" />}>Back</Button>
            <Button type="submit" size="lg" className="flex-1"
              loading={form2.formState.isSubmitting}>Create Account</Button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
