import { Heart, Phone, AlertTriangle, MapPin, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emergency Access — NIVARA",
  description: "Emergency medical record access for healthcare providers.",
  robots: { index: false },
};

// This page is publicly accessible — no auth required
// Emergency responders scan a QR code to reach this page
export default function EmergencyPage() {
  // In production: validate ?token= query param and fetch patient data
  const mockPatient = {
    name: "Ramesh Iyer",
    age: 51,
    bloodGroup: "B+",
    allergies: ["Penicillin", "Sulfa drugs"],
    conditions: ["Type 2 Diabetes", "Hypertension"],
    medications: ["Metformin 500mg (2x daily)", "Amlodipine 5mg (1x daily)"],
    emergencyContacts: [
      { name: "Anitha Iyer (Spouse)", phone: "+91 99400 77777" },
      { name: "Dr. Priya Mehta (Cardiologist)", phone: "+91 98765 11111" },
    ],
    doctorName: "Dr. Priya Mehta",
    hospital: "Apollo Hospitals, Chennai",
  };

  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency banner */}
      <div className="bg-destructive text-white px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2 font-bold">
          <AlertTriangle className="h-5 w-5" />
          <span>EMERGENCY ACCESS — Read Only · Temporary</span>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-xs text-red-200 mt-0.5">This access expires in 48 hours. All access is logged.</p>
      </div>

      {/* NIVARA branding */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
          <Heart className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-bold text-foreground">NIVARA Emergency Access</span>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4 py-8">
        {/* Patient identity */}
        <div className="bg-white rounded-2xl border border-destructive/20 shadow-card p-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <User className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{mockPatient.name}</h1>
              <p className="text-muted-foreground text-sm">Age {mockPatient.age}</p>
              <div className="flex gap-2 mt-1">
                <span className="px-2.5 py-0.5 bg-destructive text-white text-sm font-bold rounded-lg">
                  {mockPatient.bloodGroup}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Critical info */}
        <div className="grid grid-cols-1 gap-3">
          {/* Allergies */}
          <div className="bg-red-100 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="font-bold text-destructive text-sm uppercase tracking-wide">⚠ ALLERGIES</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockPatient.allergies.map((a) => (
                <span key={a} className="px-3 py-1 bg-destructive text-white text-sm font-semibold rounded-lg">{a}</span>
              ))}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="bg-white border border-border rounded-2xl p-4">
            <p className="font-semibold text-foreground text-sm mb-2">Medical Conditions</p>
            <ul className="space-y-1">
              {mockPatient.conditions.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Current Medications */}
          <div className="bg-white border border-border rounded-2xl p-4">
            <p className="font-semibold text-foreground text-sm mb-2">Current Medications</p>
            <ul className="space-y-1">
              {mockPatient.medications.map((m) => (
                <li key={m} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>

          {/* Primary Doctor */}
          <div className="bg-white border border-border rounded-2xl p-4">
            <p className="font-semibold text-foreground text-sm mb-1">Primary Doctor</p>
            <p className="text-sm text-foreground">{mockPatient.doctorName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" /> {mockPatient.hospital}
            </p>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-1.5">
              <Phone className="h-4 w-4" /> Emergency Contacts
            </p>
            <div className="space-y-2">
              {mockPatient.emergencyContacts.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <p className="text-sm text-foreground">{c.name}</p>
                  <a href={`tel:${c.phone}`}
                    className="px-3 py-1 bg-success text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors">
                    Call
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4">
          Powered by NIVARA Health · Secure Emergency Access System<br />
          This session is logged with timestamp and access IP for patient safety.
        </p>
      </div>
    </div>
  );
}
