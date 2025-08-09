import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const DMSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shree Padma Paints",
    template: "%s | Shree Padma Paints",
  },
  description:
    "Shree Padma Paints offers premium quality paints, coatings, and painting solutions for homes, offices, and industries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${DMSans.variable} ${DMSans.className} antialiased !bg-background !text-black`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
