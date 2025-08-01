import { AuthLayout } from "@/components/layouts/auth-layout";
import "../globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout>
      <div className="bg-[#1c1c1c]">
        <main className="w-full flex justify-center items-center min-h-screen">
          {children}
        </main>
      </div>
    </AuthLayout>
  );
}
