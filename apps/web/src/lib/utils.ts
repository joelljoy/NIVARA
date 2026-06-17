import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

export function getHealthScoreColor(score: number): string {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#4A90E2";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

export function getHealthScoreGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 45) return "D";
  return "F";
}

export function getRecordCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    lab_report: "Lab Report",
    prescription: "Prescription",
    imaging: "Imaging",
    discharge_summary: "Discharge Summary",
    vaccination: "Vaccination",
    insurance: "Insurance",
    other: "Other",
  };
  return map[category] || category;
}

export function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    patient: "Patient",
    doctor: "Doctor",
    hospital_admin: "Hospital Admin",
    family_caregiver: "Family Caregiver",
    insurance_reviewer: "Insurance Reviewer",
    system_admin: "System Admin",
  };
  return map[role] || role;
}
