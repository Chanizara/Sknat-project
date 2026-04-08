"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { emit } from "./socket";

export interface AuthUser {
  id: number;
  username: string;
  role: "admin" | "seller";
  fullName?: string;
  phone?: string;
  email?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => "not ready",
  logout: () => {},
});

const STORAGE_KEY = "sknat_admin_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    const res = await emit<AuthUser>("auth:login", { username, password });
    if (!res.ok || !res.data) return res.error ?? "เข้าสู่ระบบไม่สำเร็จ";
    setUser(res.data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
    return null; // null = success
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
