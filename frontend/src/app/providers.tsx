"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthLoader } from "@/components/auth/auth-loader";
import { ConfirmDialogProvider } from "@/contexts/confirm-dialog-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1_000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <AuthLoader>
              <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
            </AuthLoader>
          </SidebarProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}
