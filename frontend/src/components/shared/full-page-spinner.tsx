"use client";
import { useLoadingStore } from "@/store/loading-store";
import { Loader2 } from "lucide-react";

export const FullPageSpinner = () => {
  const isLoading = useLoadingStore();

  if (!isLoading) {
    return null; // Render nothing if not loading
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};
