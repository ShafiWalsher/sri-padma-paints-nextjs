"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullPageSpinner } from "@/components/shared/full-page-spinner";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        (async () => {
          await logout();
          router.replace("/login");
        })();
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, logout]);

  if (isLoading || !isAuthenticated) {
    return <FullPageSpinner />;
  }

  return <>{children}</>;
}
