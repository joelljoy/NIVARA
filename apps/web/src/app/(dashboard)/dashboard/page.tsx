"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDate, getHealthScoreColor, getHealthScoreGrade } from "@/lib/utils";
import {
  Activity, FileText, Pill, Calendar, AlertCircle,
  Brain, ChevronRight, TrendingUp, TrendingDown, Heart,
  Zap, Clock, Phone,
} from "lucide-react";
import Link from "next/link";
import type { HealthScore, Vitals, Medication, Appointment, MedicalRecord } from "@/types";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

// Mock data used when API is not connected
const MOCK_VITALS_TREND = [
  { date: "Jun 1",  bp: 118 }, { date: "Jun 5",  bp: 122 },
  { date: "Jun 10", bp: 119 }, { date: "Jun 14", bp: 121 },
  { date: "Jun 17", bp: 116 },
];

function HealthScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = getHealthScoreColor(score);
  const grade = getHealthScoreGrade(score);

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="health-ring w-36 h-36 absolute">
        <circle className="health-ring-track" cx="72" cy="72" r={r} />
        <circle
          className="health-ring-fill"
          cx="72" cy="72" r={r}
          strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          style={{ stroke: color }}
        />
      </svg>
      <div className="text-center z-10">
        <p className="text-3xl font-bold text-foreground">{score}</p>
        <p className="text-xs text-muted-foreground">Grade {grade}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: healthScore, isLoading: loadingScore } = useQuery<HealthScore>({
    queryKey: ["health-score"],
    queryFn: async () => {
      try { const r = await api.get("/health/score"); return r.data.data; }
      catch { return { score: 78, grade: "B", breakdown: { vitals: 82, medications: 90, appointments: 70, records: 68 }, lastUpdated: new Date().toISOString() }; }
    },
  });

  const { data: recentRecords } = useQuery<MedicalRecord[]>({
    queryKey: ["records", "recent"],
    queryFn: async () => {
      try { const r = await api.get("/records?limit=3"); return r.data.data; }
      catch { return [
        { id: "1", title: "Blood CBC Report", category: "lab_report",  uploadedAt: new Date().toISOString(), fileType: "pdf" },
        { id: "2", title: "Metformin 500mg",  category: "prescription", uploadedAt: new Date(Date.now() - 86400000*3).toISOString(), fileType: "pdf" },
        { id: "3", title: "Chest X-Ray",      category: "imaging",     uploadedAt: new Date(Date.now() - 86400000*7).toISOString(), fileType: "image" },
      ] as MedicalRecord[]; }
    },
  });

  const { data: medications } = useQuery<Medication[]>({
    queryKey: ["medications"],
    queryFn: async () => {
      try { const r = await api.get("/medications?active=true&limit=3"); return r.data.data; }
      catch { return [
        { id: "1", name: "Metformin", dosage: "500mg", frequency: "Twice daily", isActive: true, reminderEnabled: true } as Medication,
        { id: "2", name: "Amlodipine", dosage: "5mg", frequency: "Once daily", isActive: true, reminderEnabled: true } as Medication,
      ]; }
    },
  });

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ["appointments", "upcoming"],
    queryFn: async () => {
      try { const r = await api.get("/appointments?status=upcoming&limit=2"); return r.data.data; }
      catch { return [
        { id: "1", doctorName: "Dr. Priya Mehta", specialty: "Cardiologist", scheduledAt: new Date(Date.now() + 86400000*2).toISOString(), status: "upcoming", type: "in_person" } as Appointment,
      ]; }
    },
  });

  const aiInsights = [
    { title: "Good hydration", detail: "Your vitals indicate adequate hydration this week.", color: "text-success", bg: "bg-success/10" },
    { title: "Medication on track", detail: "95% compliance with Metformin this month.", color: "text-primary", bg: "bg-primary/10" },
    { title: "Check-up due", detail: "Annual HbA1c test is recommended next month.", color: "text-warning", bg: "bg-warning/10" },
  ];

  const quickStats = [
    { label: "Records",     value: "12",  icon: <FileText className="h-4 w-4" />,   color: "text-primary",  bg: "bg-primary/8",  href: "/records" },
    { label: "Medications", value: "3",   icon: <Pill className="h-4 w-4" />,       color: "text-purple-600", bg: "bg-purple-50", href: "/dashboard/medications" },
    { label: "Appointments",value: "2",   icon: <Calendar className="h-4 w-4" />,   color: "text-teal-600", bg: "bg-teal-50",    href: "/dashboard/appointments" },
    { label: "AI Reports",  value: "4",   icon: <Brain className="h-4 w-4" />,      color: "text-orange-600", bg: "bg-orange-50", href: "/ai/simplifier" },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good morning, {user?.firstName} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Here&apos;s your health summary for today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/emergency">
            <Button variant="outline" size="sm" leftIcon={<Phone className="h-3.5 w-3.5" />} className="text-destructive border-destructive/30 hover:bg-destructive/5">
              Emergency
            </Button>
          </Link>
          <Link href="/records/upload">
            <Button size="sm" leftIcon={<FileText className="h-3.5 w-3.5" />}>
              Upload Record
            </Button>
          </Link>
        </div>
      </div>

      {/* Top row: Health Score + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Health Score */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Health Score</CardTitle>
            <Badge variant="success" dot>Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {loadingScore ? (
                <Skeleton className="h-36 w-36 rounded-full" />
              ) : (
                <HealthScoreRing score={healthScore?.score ?? 78} />
              )}
              <div className="space-y-2.5">
                {healthScore?.breakdown && Object.entries(healthScore.breakdown).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-semibold text-foreground">{val}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-3">
          {quickStats.map((s) => (
            <Link key={s.label} href={s.href}>
              <Card hover className="h-full">
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {/* BP mini-chart */}
          <Card padding="sm" className="col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Blood Pressure</span>
                <Badge variant="success" dot className="text-[10px]">Normal</Badge>
              </div>
              <Link href="/analytics" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <ResponsiveContainer width="100%" height={55}>
              <LineChart data={MOCK_VITALS_TREND}>
                <Line type="monotone" dataKey="bp" stroke="#4A90E2" strokeWidth={2} dot={false} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 11 }}
                  formatter={(v) => [`${v} mmHg`, "Systolic"]}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <CardTitle>AI Health Insights</CardTitle>
          </div>
          <Link href="/ai/assistant" className="text-sm text-primary hover:underline">Ask AI</Link>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {aiInsights.map((i) => (
              <div key={i.title} className={`${i.bg} rounded-xl p-3.5`}>
                <p className={`text-sm font-semibold ${i.color} mb-0.5`}>{i.title}</p>
                <p className="text-xs text-foreground/80">{i.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom row: Recent Records + Upcoming */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Records */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
            <Link href="/records" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {recentRecords ? (
              <div className="space-y-2">
                {recentRecords.map((rec) => (
                  <Link key={rec.id} href={`/records/${rec.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors group">
                      <div className="h-9 w-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{rec.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(rec.uploadedAt)}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : <SkeletonCard />}
            <Link href="/records/upload" className="mt-3 block">
              <Button variant="outline" size="sm" className="w-full">+ Upload new record</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Medications + Appointments */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-purple-600" />
                <CardTitle>Active Medications</CardTitle>
              </div>
              <Link href="/dashboard/medications" className="text-xs text-primary hover:underline">Manage</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {medications?.map((med) => (
                  <div key={med.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface">
                    <div className="h-2 w-2 rounded-full bg-success flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{med.name} <span className="text-muted-foreground font-normal">{med.dosage}</span></p>
                      <p className="text-xs text-muted-foreground">{med.frequency}</p>
                    </div>
                  </div>
                )) ?? <Skeleton className="h-10 w-full" />}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-600" />
                <CardTitle>Upcoming</CardTitle>
              </div>
              <Link href="/dashboard/appointments" className="text-xs text-primary hover:underline">All</Link>
            </CardHeader>
            <CardContent>
              {appointments?.map((apt) => (
                <div key={apt.id} className="flex items-start gap-3 p-3 bg-surface rounded-xl">
                  <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{apt.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                    <p className="text-xs text-primary mt-0.5 font-medium">{formatDate(apt.scheduledAt, { weekday: "short", month: "short", day: "numeric" })}</p>
                  </div>
                </div>
              )) ?? <Skeleton className="h-16 w-full" />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
