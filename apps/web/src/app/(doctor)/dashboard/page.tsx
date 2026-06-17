"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, FileText, Clock, Activity, Stethoscope, ChevronRight } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { formatDate, getInitials } from "@/lib/utils";
import type { User, Appointment } from "@/types";

const MOCK_PATIENTS = [
  { id: "p1", firstName: "Ramesh", lastName: "Iyer",    email: "ramesh@example.com", dateOfBirth: "1975-04-12", lastVisit: "2026-06-10", condition: "Type 2 Diabetes", records: 12, status: "active" },
  { id: "p2", firstName: "Sunita", lastName: "Sharma",  email: "sunita@example.com", dateOfBirth: "1982-08-23", lastVisit: "2026-06-05", condition: "Hypertension",    records: 8,  status: "active" },
  { id: "p3", firstName: "Arjun",  lastName: "Patel",   email: "arjun@example.com",  dateOfBirth: "1990-01-15", lastVisit: "2026-05-28", condition: "Asthma",          records: 5,  status: "active" },
  { id: "p4", firstName: "Meena",  lastName: "Nair",    email: "meena@example.com",  dateOfBirth: "1968-11-30", lastVisit: "2026-05-20", condition: "Hypothyroidism",  records: 15, status: "active" },
  { id: "p5", firstName: "Vivek",  lastName: "Reddy",   email: "vivek@example.com",  dateOfBirth: "1985-07-04", lastVisit: "2026-05-01", condition: "Anxiety",         records: 3,  status: "inactive" },
];

export default function DoctorDashboardPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_PATIENTS.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Patients", value: MOCK_PATIENTS.length, icon: <Users className="h-4 w-4" />, color: "text-primary bg-primary/8" },
    { label: "Today's Appointments", value: 4, icon: <Clock className="h-4 w-4" />, color: "text-teal-600 bg-teal-50" },
    { label: "Pending Reviews", value: 2, icon: <FileText className="h-4 w-4" />, color: "text-warning bg-yellow-50" },
    { label: "Active Cases", value: MOCK_PATIENTS.filter((p) => p.status === "active").length, icon: <Activity className="h-4 w-4" />, color: "text-success bg-success/8" },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" /> Doctor Portal
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your patients and medical records.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} padding="sm">
            <div className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <CardTitle>Today&apos;s Queue</CardTitle>
          </div>
          <Badge variant="primary">4 appointments</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { time: "09:30", name: "Ramesh Iyer",   type: "Follow-up",   status: "completed" },
              { time: "10:30", name: "Sunita Sharma",  type: "Consultation", status: "in_progress" },
              { time: "12:00", name: "Arjun Patel",    type: "Review",       status: "upcoming" },
              { time: "15:00", name: "Meena Nair",     type: "Follow-up",   status: "upcoming" },
            ].map((apt) => (
              <div key={apt.time} className="flex items-center gap-4 p-3 rounded-xl bg-surface">
                <p className="text-sm font-mono font-semibold text-muted-foreground w-12 flex-shrink-0">{apt.time}</p>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{apt.name}</p>
                  <p className="text-xs text-muted-foreground">{apt.type}</p>
                </div>
                <Badge variant={
                  apt.status === "completed" ? "muted" :
                  apt.status === "in_progress" ? "success" : "default"
                } dot={apt.status === "in_progress"}>
                  {apt.status === "in_progress" ? "In Progress" : apt.status === "completed" ? "Done" : "Upcoming"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle>My Patients</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name or condition…"
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            wrapperClassName="mb-4"
          />
          <div className="space-y-2">
            {filtered.map((patient) => (
              <Link key={patient.id} href={`/doctor/patients/${patient.id}`}>
                <div className="flex items-center gap-4 p-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-surface transition-all group">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                    {getInitials(`${patient.firstName} ${patient.lastName}`)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{patient.firstName} {patient.lastName}</p>
                    <p className="text-xs text-muted-foreground">{patient.condition} · Last visit {formatDate(patient.lastVisit)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="muted">{patient.records} records</Badge>
                    <Badge variant={patient.status === "active" ? "success" : "muted"}>{patient.status}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
