import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export const allowedColors = [
  "primary",
  "secondary",
  "destructive",
  "success",
  "black",
  "white",
] as const;

export type AllowedColors = (typeof allowedColors)[number];
export type ButtonSize = "sm" | "md" | "lg";

export interface PageActionItem {
  key: string;
  url: string;
  label: string;
  color: AllowedColors;
  icon?: LucideIcon;
}

interface PageActionsComponentProps {
  actions: PageActionItem[];
  className?: string;
  size?: ButtonSize;
}

const colorClasses: Record<AllowedColors, string> = {
  primary: "bg-primaty text-white hover:bg-primary/90",
  secondary: "bg-black/70 text-white hover:bg-black/60",
  destructive: "bg-rose-700 text-white hover:bg-rose-700/90",
  success: "bg-green-700/80 text-white hover:bg-green-700/70",
  black: "bg-black/90 text-white hover:bg-black/80",
  white: "bg-white border border-border hover:bg-black/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export const PageActionButtons: React.FC<PageActionsComponentProps> = ({
  actions,
  className = "",
  size = "md",
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.key}
            href={action.url}
            className={cn(
              "rounded-md font-medium transition-all duration-300 flex gap-1",
              sizeClasses[size],
              colorClasses[action.color]
            )}
          >
            {Icon && <Icon size={20} />}
            {action.label}
          </Link>
        );
      })}
    </div>
  );
};
