import Link from "next/link";
import { Heart, Shield, Brain, Globe, ArrowRight, CheckCircle, Star, Activity, FileText, Users, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NIVARA — Your Health, Simplified",
  description: "AI-powered health data management system. Store, understand, and share your medical records securely.",
};

const features = [
  { icon: <Brain className="h-5 w-5" />, title: "AI Report Simplifier", desc: "Complex medical jargon converted into plain language you actually understand." },
  { icon: <Shield className="h-5 w-5" />, title: "Consent Management", desc: "You control who sees your health data, for how long, and what exactly they can access." },
  { icon: <Globe className="h-5 w-5" />, title: "Multilingual Support", desc: "Available in Hindi, Marathi, Tamil, Malayalam, Kannada, Gujarati, and English." },
  { icon: <Activity className="h-5 w-5" />, title: "Health Analytics", desc: "Track vitals trends, medication compliance, and get AI-powered health insights." },
  { icon: <FileText className="h-5 w-5" />, title: "Smart OCR", desc: "Upload any medical document — prescriptions, lab reports — and we extract the data automatically." },
  { icon: <Users className="h-5 w-5" />, title: "Family Management", desc: "Manage health records for your entire family, including elderly parents and children." },
];

const testimonials = [
  { name: "Dr. Priya Mehta",    role: "Cardiologist, Apollo Mumbai",     text: "NIVARA has transformed how I access patient history. The consent system is thoughtful and secure.", rating: 5 },
  { name: "Ramesh Iyer",        role: "Patient, Chennai",                text: "Finally I understand my blood reports! The AI simplification is incredibly helpful.", rating: 5 },
  { name: "Sunita Agarwal",     role: "Caregiver for elderly parents",   text: "Managing my parents' records used to be a nightmare. NIVARA made it simple and peaceful.", rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-foreground tracking-tight text-lg">NIVARA</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link>
            <Link href="#security" className="hover:text-foreground transition-colors">Security</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-sm">
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/8 text-primary text-xs font-semibold rounded-full mb-6 border border-primary/20">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Now available in 7 Indian languages
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
          Your health records,<br />
          <span className="text-primary">secure & understood.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          NIVARA is India's most trusted AI-powered health data management platform.
          Store, understand, and share your medical records — in your own language, on your own terms.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-md hover:shadow-lg text-base">
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 border border-border text-foreground font-medium rounded-xl hover:bg-surface hover:border-primary/40 transition-all text-base">
            Sign in
          </Link>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">No credit card required · AES-256 encrypted · HIPAA-aligned</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto">
          {[
            { value: "50K+", label: "Patients" },
            { value: "2K+",  label: "Doctors" },
            { value: "100K+",label: "Records stored" },
            { value: "7",    label: "Languages" },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 bg-surface rounded-2xl border border-border">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Everything your health needs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Built for patients, doctors, hospitals, families, and insurers — one platform that does it all.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-border rounded-2xl p-6 hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Security you can trust</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your health data is among the most sensitive information you own.
                NIVARA is built with enterprise-grade security at every layer.
              </p>
              <ul className="space-y-3">
                {[
                  "AES-256 encryption for all stored files",
                  "JWT + Refresh Token authentication",
                  "Role-based access control (RBAC)",
                  "Full audit trail for every data access",
                  "Time-limited consent tokens",
                  "Rate limiting + input validation",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl p-8 border border-primary/10">
              <div className="space-y-4">
                {[
                  { label: "Encryption",        value: "AES-256",         color: "bg-success/10 text-green-700" },
                  { label: "Auth",               value: "JWT + RBAC",       color: "bg-primary/10 text-primary" },
                  { label: "HIPAA Aligned",      value: "Yes",              color: "bg-success/10 text-green-700" },
                  { label: "Audit Logs",         value: "Full history",     color: "bg-primary/10 text-primary" },
                  { label: "Consent Engine",     value: "Time-limited",     color: "bg-purple-50 text-purple-700" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-border shadow-card">
                    <span className="text-sm font-medium text-foreground">{row.label}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-surface py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Trusted by patients and doctors</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-border rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary text-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Start managing your health smarter</h2>
          <p className="text-white/80 mb-8 text-lg">Join thousands of Indians who trust NIVARA with their most important data.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-lg text-base">
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-foreground">NIVARA</span>
          </Link>
          <p className="text-xs text-muted-foreground">© 2026 NIVARA Health. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
