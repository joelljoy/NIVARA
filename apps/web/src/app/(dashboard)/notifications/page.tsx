"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Bell, Pill, Calendar, FileText, AlertCircle, Shield, CheckCheck } from "lucide-react";
import { useState } from "react";
import { formatDateTime, cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", userId: "u1", type: "medication_reminder", title: "Metformin Reminder",       message: "Time to take your Metformin 500mg. Take with meals.", isRead: false, createdAt: new Date().toISOString() },
  { id: "2", userId: "u1", type: "appointment_reminder", title: "Appointment Tomorrow",    message: "You have an appointment with Dr. Priya Mehta tomorrow at 10:30 AM.", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", userId: "u1", type: "health_alert",        title: "Blood Pressure Normal",   message: "Your latest reading (115/74) is in the healthy range. Great progress!", isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "4", userId: "u1", type: "consent_request",     title: "Access Request",          message: "Dr. Anil Kumar (City Clinic) is requesting access to your Lab Reports.", isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString(), actionUrl: "/consent" },
  { id: "5", userId: "u1", type: "document_expiry",     title: "Insurance Document Expiring", message: "Your health insurance policy document expires in 7 days. Upload a renewed copy.", isRead: true, createdAt: new Date(Date.now() - 86400000*2).toISOString() },
  { id: "6", userId: "u1", type: "medication_reminder", title: "Amlodipine Reminder",     message: "Time to take your Amlodipine 5mg.", isRead: true, createdAt: new Date(Date.now() - 86400000*3).toISOString() },
];

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  medication_reminder: <Pill className="h-4 w-4 text-purple-600" />,
  appointment_reminder:<Calendar className="h-4 w-4 text-teal-600" />,
  document_expiry:     <FileText className="h-4 w-4 text-warning" />,
  health_alert:        <AlertCircle className="h-4 w-4 text-primary" />,
  consent_request:     <Shield className="h-4 w-4 text-orange-600" />,
  system:              <Bell className="h-4 w-4 text-muted-foreground" />,
};

const TYPE_BG: Record<NotificationType, string> = {
  medication_reminder:  "bg-purple-50",
  appointment_reminder: "bg-teal-50",
  document_expiry:      "bg-yellow-50",
  health_alert:         "bg-blue-50",
  consent_request:      "bg-orange-50",
  system:               "bg-muted",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, isRead: true })));
  const markRead = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, isRead: true } : n));

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayed = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" /> Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">{unreadCount} unread notifications</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" leftIcon={<CheckCheck className="h-4 w-4" />} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { v: "all",    label: `All (${notifications.length})` },
          { v: "unread", label: `Unread (${unreadCount})` },
        ].map((f) => (
          <button key={f.v} onClick={() => setFilter(f.v as any)}
            className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === f.v ? "bg-primary text-white" : "bg-surface text-muted-foreground hover:bg-muted")}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {displayed.length === 0 ? (
          <Card><p className="text-center text-muted-foreground py-12 text-sm">No notifications to show.</p></Card>
        ) : displayed.map((n) => (
          <div key={n.id}
            onClick={() => markRead(n.id)}
            className={cn(
              "flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-card-md",
              n.isRead ? "bg-white border-border" : "bg-white border-primary/20 shadow-glow"
            )}
          >
            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0", TYPE_BG[n.type])}>
              {TYPE_ICONS[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={cn("text-sm font-semibold", n.isRead ? "text-foreground" : "text-foreground")}>{n.title}</p>
                {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{formatDateTime(n.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
