"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "./api";
import { toast } from "sonner";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("shiras_admin_token");
      const storedAdmin = localStorage.getItem("shiras_admin_user");

      if (storedToken && storedAdmin) {
        try {
          setToken(storedToken);
          setAdmin(JSON.parse(storedAdmin));
          // Verify with server in background
          const res = await api.getMe();
          if (res.success && res.data) {
            setAdmin((prev) => ({ ...prev, ...res.data, token: storedToken }));
          }
        } catch (err) {
          console.warn("[Auth] Token session expired or invalid");
          localStorage.removeItem("shiras_admin_token");
          localStorage.removeItem("shiras_admin_user");
          setToken(null);
          setAdmin(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        const user = res.data;
        setAdmin(user);
        setToken(user.token);
        localStorage.setItem("shiras_admin_token", user.token);
        localStorage.setItem("shiras_admin_user", JSON.stringify(user));
        toast.success("Welcome back, Admin!", {
          description: "Logged in to Shira's Strokes Studio.",
        });
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to log in");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("shiras_admin_token");
    localStorage.removeItem("shiras_admin_user");
    setAdmin(null);
    setToken(null);
    toast.info("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname.startsWith("/admin") && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return { isAuthenticated, isLoading };
}
