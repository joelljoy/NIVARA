import type { Metadata } from "next";
import { Heart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Sign In" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col bg-gradient-to-br from-primary-600 via-primary to-primary-400 p-12 text-white relative overflow-hidden flex-shrink-0">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-8" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight">NIVARA</span>
            <p className="text-xs text-white/70 -mt-0.5">Health Platform</p>
          </div>
        </Link>

        {/* Hero text */}
        <div className="mt-auto relative z-10">
          <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
            Your health data,<br />
            <span className="text-secondary">always with you.</span>
          </h2>
          <p className="text-white/80 text-base leading-relaxed mb-8">
            NIVARA keeps your medical records secure, readable, and accessible — 
            wherever you are. AI-powered insights, trusted by patients and doctors across India.
          </p>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "50K+",   label: "Patients" },
              { value: "2K+",    label: "Doctors" },
              { value: "100K+",  label: "Records stored" },
              { value: "AES-256",label: "Encrypted" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-lg font-bold">{item.value}</p>
                <p className="text-xs text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">NIVARA</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
