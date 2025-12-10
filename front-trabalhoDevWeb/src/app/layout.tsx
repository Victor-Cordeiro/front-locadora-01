import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Locadora Passatempo",
  description: "Sistema de Gerenciamento de Locadora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      {/* Removemos flex, ml-64 e p-6 daqui. O body ocupa 100% */}
      <body className="min-h-screen bg-white">
            {children}
            <Toaster />
      </body>
    </html>
  );
}