import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Timer",
  description: "Time-based rewards on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-black">
      <body className={`${inter.className} bg-black min-h-screen`}>
        <ThemeProvider>
          <div className="flex min-h-screen bg-black">
            <Sidebar className="w-64 hidden md:block fixed h-screen" />
            <div className="flex-1 md:ml-64 bg-black min-h-screen">
              <main className="min-h-screen bg-black">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
