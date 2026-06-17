// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole =
  | 'patient'
  | 'doctor'
  | 'hospital_admin'
  | 'family_caregiver'
  | 'insurance_reviewer'
  | 'system_admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  elderlyMode: boolean;
  language: SupportedLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

// ─── Health & Vitals ──────────────────────────────────────────────────────────

export interface Vitals {
  id: string;
  patientId: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  bloodSugar?: number;
  bloodSugarType?: 'fasting' | 'post_meal' | 'random';
  weight?: number;
  height?: number;
  bmi?: number;
  spo2?: number;
  temperature?: number;
  recordedAt: string;
  notes?: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
  isActive: boolean;
  reminderEnabled: boolean;
  reminderTimes?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId?: string;
  doctorName: string;
  specialty?: string;
  hospitalName?: string;
  scheduledAt: string;
  duration?: number;
  type: 'in_person' | 'telemedicine' | 'followup';
  status: 'upcoming' | 'completed' | 'cancelled' | 'missed';
  notes?: string;
  location?: string;
}

export interface HealthScore {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    vitals: number;
    medications: number;
    appointments: number;
    records: number;
  };
  lastUpdated: string;
}

// ─── Medical Records ──────────────────────────────────────────────────────────

export type RecordCategory =
  | 'lab_report'
  | 'prescription'
  | 'imaging'
  | 'discharge_summary'
  | 'vaccination'
  | 'insurance'
  | 'other';

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  category: RecordCategory;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  fileSize: number;
  ocrText?: string;
  tags?: string[];
  doctorName?: string;
  hospitalName?: string;
  recordDate?: string;
  isEncrypted: boolean;
  version: number;
  uploadedAt: string;
  updatedAt: string;
}

export interface RecordVersion {
  id: string;
  recordId: string;
  version: number;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface SimplifiedReport {
  originalText: string;
  summary: string;
  riskFactors: string[];
  recommendedActions: string[];
  doctorQuestions: string[];
  patientExplanation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface BillAnalysis {
  totalAmount: number;
  breakdown: BillLineItem[];
  anomalies: string[];
  summary: string;
  recommendations: string[];
}

export interface BillLineItem {
  service: string;
  description: string;
  amount: number;
  isAnomaly: boolean;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ─── Consent ──────────────────────────────────────────────────────────────────

export type ConsentAccessLevel = 'read_only' | 'full_access' | 'emergency';

export interface ConsentGrant {
  id: string;
  patientId: string;
  granteeId: string;
  granteeName: string;
  granteeRole: UserRole;
  accessLevel: ConsentAccessLevel;
  recordIds?: string[];
  isFullProfile: boolean;
  expiresAt?: string;
  isActive: boolean;
  grantedAt: string;
  revokedAt?: string;
}

export interface ConsentAuditLog {
  id: string;
  consentId: string;
  action: 'granted' | 'revoked' | 'accessed' | 'expired';
  performedBy: string;
  performedAt: string;
  ipAddress?: string;
  details?: string;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface DoctorProfile {
  id: string;
  userId: string;
  specialization: string;
  licenseNumber: string;
  hospitalAffiliation?: string;
  yearsOfExperience?: number;
  languages?: string[];
  bio?: string;
}

export interface VisitNote {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  followUpDate?: string;
  prescriptions?: Medication[];
  attachments?: string[];
  createdAt: string;
}

// ─── Family ───────────────────────────────────────────────────────────────────

export interface FamilyMember {
  id: string;
  primaryUserId: string;
  memberId?: string;
  name: string;
  relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'grandparent' | 'other';
  dateOfBirth?: string;
  phone?: string;
  isEmergencyContact: boolean;
  accessLevel: 'view' | 'manage' | 'full';
  linkedAccount?: User;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | 'medication_reminder'
  | 'appointment_reminder'
  | 'document_expiry'
  | 'health_alert'
  | 'consent_request'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'ml' | 'kn' | 'gu';

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  ta: 'தமிழ்',
  ml: 'മലയാളം',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
};

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
