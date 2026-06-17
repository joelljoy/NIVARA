"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, Brain, Receipt, Shield, Users,
  Activity, Bell, BarChart3, Settings, LogOut, Heart,
  Phone, Calendar, Pill, X, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getInitials } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: "success" | "warning" | "destructive" | "default";
}

const patientNav: NavItem[] = [
  { label: "Dashboard",       href: "/dashboard",           icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Medical Records", href: "/records",             icon: <FileText className="h-4 w-4" /> },
  { label: "AI Simplifier",   href: "/ai/simplifier",       icon: <Brain className="h-4 w-4" /> },
  { label: "Bill Analyzer",   href: "/ai/bill-analyzer",    icon: <Receipt className="h-4 w-4" /> },
  { label: "AI Assistant",    href: "/ai/assistant",         icon: <Brain className="h-4 w-4" /> },
  { label: "Vitals",          href: "/dashboard/vitals",    icon: <Activity className="h-4 w-4" /> },
  { label: "Medications",     href: "/dashboard/medications",icon: <Pill className="h-4 w-4" /> },
  { label: "Appointments",    href: "/dashboard/appointments",icon: <Calendar className="h-4 w-4" /> },
  { label: "Consent",         href: "/consent",             icon: <Shield className="h-4 w-4" /> },
  { label: "Family",          href: "/family",              icon: <Users className="h-4 w-4" /> },
  { label: "Analytics",       href: "/analytics",           icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Notifications",   href: "/notifications",       icon: <Bell className="h-4 w-4" /> },
];

const doctorNav: NavItem[] = [
  { label: "Dashboard",   href: "/doctor/dashboard",  icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Patients",    href: "/doctor/patients",   icon: <Users className="h-4 w-4" /> },
  { label: "Notifications", href: "/notifications",   icon: <Bell className="h-4 w-4" /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard",  href: "/admin/dashboard",   icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Users",      href: "/admin/users",        icon: <Users className="h-4 w-4" /> },
];

const insuranceNav: NavItem[] = [
  { label: "Dashboard",  href: "/insurance/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Claims",     href: "/insurance/claims",    icon: <FileText className="h-4 w-4" /> },
];

function getNav(role: string): NavItem[] {
  if (role === "doctor")             return doctorNav;
  if (role === "hospital_admin" || role === "system_admin") return adminNav;
  if (role === "insurance_reviewer") return insuranceNav;
  return patientNav;
}

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const navItems = getNav(user?.role || "patient");

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "dashboard-sidebar flex flex-col",
          open ? "open" : ""
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-foreground tracking-tight">NIVARA</span>
              <p className="text-[10px] text-muted-foreground -mt-0.5 leading-none">Health Platform</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-surface text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                )}
              >
                <span className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant={item.badgeVariant || "default"} className="text-[10px] py-0">
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="h-3 w-3 text-primary/60 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: User + Settings + Logout */}
        <div className="border-t border-border p-3 space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground transition-all"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          {/* User card */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface mt-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                {getInitials(`${user.firstName} ${user.lastName}`)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate capitalize">
                  {user.role.replace("_", " ")}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
