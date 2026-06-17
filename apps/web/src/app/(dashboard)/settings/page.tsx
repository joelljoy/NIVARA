"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useElderlyMode } from "@/contexts/ElderlyModeContext";
import { Settings, User, Bell, Shield, Accessibility, Globe, LogOut, Moon, Sun, Eye } from "lucide-react";
import { useState } from "react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/types";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { elderlyMode, toggleElderlyMode } = useElderlyMode();
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [notifications, setNotifications] = useState({
    medication: true, appointments: true, reports: true, consent: true, health: false,
  });
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your account preferences and accessibility options.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /><CardTitle>Profile</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
              {user ? getInitials(`${user.firstName} ${user.lastName}`) : "?"}
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="default" className="mt-1 capitalize">{user?.role?.replace("_"," ")}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" defaultValue={user?.firstName} />
            <Input label="Last name"  defaultValue={user?.lastName} />
          </div>
          <Input label="Email" type="email" defaultValue={user?.email} />
          <Input label="Phone" type="tel" defaultValue={user?.phone} />
          <Button>Save Profile</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /><CardTitle>Notifications</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: "medication",    label: "Medication reminders",       desc: "Daily reminders for your medications" },
            { key: "appointments",  label: "Appointment reminders",      desc: "Alerts for upcoming appointments" },
            { key: "reports",       label: "Report upload alerts",        desc: "When OCR extraction is complete" },
            { key: "consent",       label: "Consent requests",           desc: "When someone requests access to your records" },
            { key: "health",        label: "AI health alerts",           desc: "Personalized health insights from AI" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                className={cn("h-6 w-11 rounded-full transition-all duration-200 relative flex-shrink-0",
                  notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-muted")}
              >
                <span className={cn("absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-all duration-200",
                  notifications[item.key as keyof typeof notifications] ? "left-5.5 translate-x-0.5" : "left-0.5")} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /><CardTitle>Language</CardTitle></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(SUPPORTED_LANGUAGES) as [SupportedLanguage, string][]).map(([code, name]) => (
              <button key={code} onClick={() => setLanguage(code)}
                className={cn("px-4 py-2.5 rounded-xl border text-left text-sm transition-all",
                  language === code ? "border-primary bg-primary/8 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/30")}>
                {name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Accessibility className="h-4 w-4 text-primary" /><CardTitle>Accessibility</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: "elderly", label: "Elderly Mode", desc: "Larger text, simplified layout, voice navigation", value: elderlyMode, toggle: toggleElderlyMode },
            { key: "contrast", label: "High Contrast", desc: "Increased color contrast for better visibility", value: highContrast, toggle: () => setHighContrast((p) => !p) },
            { key: "largeText", label: "Large Text", desc: "Increase base font size across the app", value: largeText, toggle: () => setLargeText((p) => !p) },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                id={`toggle-${item.key}`}
                onClick={item.toggle}
                className={cn("h-6 w-11 rounded-full transition-all duration-200 relative flex-shrink-0",
                  item.value ? "bg-primary" : "bg-muted")}
              >
                <span className={cn("absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-all duration-200",
                  item.value ? "translate-x-5" : "translate-x-0.5")} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /><CardTitle>Security</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">Change Password</Button>
          <Button variant="outline" className="w-full justify-start">Export My Data (GDPR)</Button>
          <Button variant="outline" className="w-full justify-start text-destructive border-destructive/30 hover:bg-destructive/5">Delete Account</Button>
        </CardContent>
      </Card>

      {/* Sign out */}
      <Button variant="outline" size="lg" onClick={logout} className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
        leftIcon={<LogOut className="h-4 w-4" />}>
        Sign Out
      </Button>
    </div>
  );
}
