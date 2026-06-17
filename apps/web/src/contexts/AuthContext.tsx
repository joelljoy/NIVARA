"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { User, LoginDto, RegisterDto } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (credentials: LoginDto) => {
    const { data } = await api.post("/auth/login", credentials);
    const { accessToken, refreshToken, user: userData } = data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(userData);
    const redirectMap: Record<string, string> = {
      patient: "/dashboard",
      doctor: "/doctor/dashboard",
      hospital_admin: "/admin/dashboard",
      family_caregiver: "/dashboard",
      insurance_reviewer: "/insurance/dashboard",
      system_admin: "/admin/dashboard",
    };
    router.push(redirectMap[userData.role] || "/dashboard");
  };

  const register = async (formData: RegisterDto) => {
    const { data } = await api.post("/auth/register", formData);
    const { accessToken, refreshToken, user: userData } = data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(userData);
    router.push("/verify-otp");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch { /* ignore */ }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
