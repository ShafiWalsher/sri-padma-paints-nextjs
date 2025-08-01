"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface DynamicBreadcrumbProps {
  className?: string;
}

export default function DynamicBreadcrumb({
  className,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname(); // e.g., /products/shoes/nike-air-max

  const segments = pathname.split("/").filter(Boolean); // ['products', 'shoes', 'nike-air-max']

  const crumbs = segments.map((seg, idx) => {
    // Build the href progressively
    const href = "/" + segments.slice(0, idx + 1).join("/");

    // Format the segment for readability
    const label = decodeURIComponent(seg)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return { href, label };
  });

  // Render the trail
  return (
    <Breadcrumb>
      <BreadcrumbList
        className={cn("text-sm space-x-1 flex !gap-0", className)}
      >
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="text-primary-text-muted hover:text-primary-text"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((crumb, idx) => (
          <div key={crumb.href} className="flex items-center space-x-1">
            <BreadcrumbSeparator className="text-primary-text-muted">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {idx === crumbs.length - 1 ? (
                <BreadcrumbPage className="text-primary-text-muted">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={crumb.href}
                  className="text-primary-text-muted hover:text-primary-text"
                >
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
