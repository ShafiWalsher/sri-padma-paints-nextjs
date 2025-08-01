import "../globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-[#1c1c1c] w-full flex justify-center items-center min-h-screen">
      {children}
    </main>
  );
}
