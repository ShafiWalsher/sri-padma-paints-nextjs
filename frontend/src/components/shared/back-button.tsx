"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  fallbackPath?: string;
  overridePath?: string;
  label?: string;
}

export default function BackButton({
  fallbackPath = "/",
  label = "Back",
  overridePath: overrridePath,
}: BackButtonProps) {
  const handleBack = () => {
    if (overrridePath) {
      window.location.href = overrridePath;
    } else {
      if (typeof window !== "undefined" && window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = fallbackPath;
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="gap-2 h-10 w-10 hover:cursor-pointer hover:bg-gray-50 border-[1px] border-gray-300 rounded-xl"
    >
      <ChevronLeft className="h-6 w-6" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
