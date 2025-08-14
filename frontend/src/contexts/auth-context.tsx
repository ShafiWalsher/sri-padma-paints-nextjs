"use client";

import type { User } from "@/types/user";
import { createContext, useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import axioInstance from "@/lib/axios";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// Context creation
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const PUBLIC_PATHS = ["/login", "/404"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Define auth status checker **outside** useEffect—avoids missing-dep warning
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await axioInstance.get<{ success: boolean; data: User }>(
        "/auth/status.php"
      );
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
        router.replace("/login");
      }
    } catch {
      setUser(null);
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  const login = (userData: User) => {
    setUser(userData);
    // Redirect based on role
    switch (userData.role) {
      case "admin":
        router.replace("/");
        break;
      case "employee":
        router.replace("/customers");
        break;
      case "manager":
        router.replace("/customers");
        break;
      default:
        router.replace("/");
    }
  };

  const logout = async () => {
    try {
      await axioInstance.post("/auth/logout.php");
    } finally {
      setUser(null);
      router.replace("/login");
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
