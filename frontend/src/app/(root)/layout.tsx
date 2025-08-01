import "../globals.css";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <main className="p-4 bg-foreground m-4 ml-6 mb-6 rounded-xl shadow-md h-full">
            {children}
          </main>
          <footer className="mt-auto bg-gray-50 px-8 py-3">
            <span className="font-medium text-black/80 text-sm">
              Designed & Developed by Shafi with{" "}
              <a
                href="https://technest-edtech.com/"
                target="_blank"
                className="text-blue-600"
              >
                Technest
              </a>
            </span>
          </footer>
        </div>
      </SidebarInset>
    </>
  );
}
