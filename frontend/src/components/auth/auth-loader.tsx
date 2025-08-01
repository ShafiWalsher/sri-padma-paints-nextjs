"use client";
import { useAuth } from "@/hooks/use-auth";
import { FullPageSpinner } from "@/components/shared/full-page-spinner";

export function AuthLoader({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  return <>{children}</>;
}
