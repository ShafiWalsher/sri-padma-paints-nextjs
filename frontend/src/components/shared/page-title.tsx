"use client";

import { cn } from "@/lib/utils";
import { getPageTitle } from "@/utilities";
import { usePathname } from "next/navigation";

interface PageTitleProps {
  className?: string;
}

const PageTitle = ({ className }: PageTitleProps) => {
  const pathname = usePathname() || "/";
  const title = getPageTitle(pathname);

  return (
    <div>
      <h2 className={cn("text-2xl font-semibold tracking-tight", className)}>
        {title}
      </h2>
    </div>
  );
};

export default PageTitle;
