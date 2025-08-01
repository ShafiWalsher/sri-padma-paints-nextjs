"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthLoader } from "@/components/auth/auth-loader";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <AuthLoader>{children}</AuthLoader>
          </SidebarProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}
