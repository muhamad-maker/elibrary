import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LiveChat from "@/components/LiveChat";

export const metadata: Metadata = {
  title: "E-Library Sekolah",
  description: "Perpustakaan Digital Terpadu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 relative">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <LiveChat />
      </body>
    </html>
  );
}
