"use client";

import { Bell, Search, Menu, Sun, Moon, Globe, Accessibility } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useElderlyMode } from "@/contexts/ElderlyModeContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const { user } = useAuth();
  const { elderlyMode, toggleElderlyMode } = useElderlyMode();
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

  return (
    <header className="dashboard-topbar flex items-center justify-between px-4 md:px-6 gap-4">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-surface text-muted-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <h1 className="text-base font-semibold text-foreground hidden md:block">{title}</h1>
        )}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search records, medications, doctors..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Language switcher */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 rounded-xl hover:bg-surface text-muted-foreground transition-colors flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium uppercase hidden sm:inline">{currentLang}</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[140px] bg-white border border-border rounded-xl shadow-card-lg p-1 animate-scale-in"
              sideOffset={8}
              align="end"
            >
              {(Object.entries(SUPPORTED_LANGUAGES) as [SupportedLanguage, string][]).map(([code, name]) => (
                <DropdownMenu.Item
                  key={code}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-surface text-foreground outline-none"
                  onClick={() => setCurrentLang(code)}
                >
                  {currentLang === code && <span className="text-primary text-xs">✓</span>}
                  <span className={currentLang !== code ? "pl-4" : ""}>{name}</span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Elderly mode toggle */}
        <button
          onClick={toggleElderlyMode}
          title={elderlyMode ? "Disable Elderly Mode" : "Enable Elderly Mode"}
          className={`p-2 rounded-xl transition-colors ${
            elderlyMode ? "bg-secondary/30 text-yellow-700" : "hover:bg-surface text-muted-foreground"
          }`}
        >
          <Accessibility className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-surface text-muted-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
        </Link>

        {/* User avatar */}
        {user && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold ml-1 hover:ring-2 hover:ring-primary/30 transition-all">
                {getInitials(`${user.firstName} ${user.lastName}`)}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[180px] bg-white border border-border rounded-xl shadow-card-lg p-1 animate-scale-in"
                sideOffset={8}
                align="end"
              >
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-surface text-foreground outline-none" asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive outline-none">
                  Sign Out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>
    </header>
  );
}
