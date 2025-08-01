import DynamicBreadcrumb from "./dynamic-breadcrumb";
import PageTitle from "./page-title";

export function SiteHeader() {
  return (
    <header className="flex h-20 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-20">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="space-y-1">
          <DynamicBreadcrumb />
          <PageTitle className="text-black" />
        </div>
      </div>
    </header>
  );
}
