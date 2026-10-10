
import type { Metadata } from "next";
import { Geist_Mono, Josefin_Slab } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";

const josefinSlab = Josefin_Slab({
  variable: "--font-josefin-slab",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Metis — Intelligence, Forged from Data",
    template: "%s | Metis",
  },
  description:
    "Metis is an AI-assisted platform for exploring data, training machine learning models, and deploying them.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${josefinSlab.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#F7E1CB] font-[family-name:var(--font-josefin-slab)]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
