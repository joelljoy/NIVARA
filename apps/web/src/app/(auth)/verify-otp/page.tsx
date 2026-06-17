"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verified, setVerified] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    inputs.current[0]?.focus();
    const timer = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[i] = value.slice(-1);
    setOtp(next);
    setError("");
    if (value && i < 5) inputs.current[i + 1]?.focus();
    if (next.every(Boolean) && next.join("").length === 6) handleVerify(next.join(""));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      handleVerify(text);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/verify-otp", { otp: code });
      setVerified(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      setError("Invalid or expired OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (countdown > 0) return;
    try {
      await api.post("/auth/resend-otp");
      setCountdown(60);
    } catch { /* ignore */ }
  };

  if (verified) {
    return (
      <div className="text-center animate-scale-in">
        <div className="h-16 w-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">Verified!</h2>
        <p className="text-muted-foreground text-sm">Redirecting to your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <Link href="/register" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code we sent to your email address.
        </p>
      </div>

      {/* OTP boxes */}
      <div className="flex gap-2.5 justify-center mb-6" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={cn(
              "h-13 w-11 text-center text-xl font-bold rounded-xl border bg-white transition-all duration-200",
              "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
              error ? "border-destructive" : digit ? "border-primary bg-primary/5" : "border-border",
            )}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-destructive mb-4">⚠ {error}</p>
      )}

      <Button
        onClick={() => handleVerify(otp.join(""))}
        size="lg"
        className="w-full"
        disabled={otp.join("").length !== 6}
        loading={loading}
        id="verify-otp-btn"
      >
        Verify OTP
      </Button>

      {/* Resend */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Didn&apos;t receive the code?{" "}
        <button
          onClick={resend}
          disabled={countdown > 0}
          className={cn(
            "font-medium transition-colors",
            countdown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline"
          )}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
        </button>
      </p>
    </div>
  );
}
