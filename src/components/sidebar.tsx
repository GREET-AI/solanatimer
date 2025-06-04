"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutGrid, BookOpen, LineChart, GraduationCap, Timer } from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "How it Works?",
    href: "/",
    icon: GraduationCap
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid
  },
  {
    name: "Timer",
    href: "/timer",
    icon: Timer
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: BookOpen
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: LineChart
  }
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 min-h-screen border-r relative overflow-hidden backdrop-blur-sm border-opacity-20", className)}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/10 via-purple-500/5 to-solana-green/10 animate-gradient" />
      
      {/* Glowing lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-solana-purple/30 via-solana-green/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-solana-purple/30 to-solana-green/20" />
      </div>

      <div className="space-y-4 py-4 relative">
        <div className="px-3 py-2">
          <Link href="/" className="block">
            <div className="flex items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/30 via-purple-500/20 to-solana-green/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse opacity-50" />
              <Image
                src="/clock.gif"
                alt="Timer Logo"
                width={100}
                height={100}
                priority
                className="rounded-full relative hover:scale-105 transition-transform duration-500 group-hover:rotate-12"
              />
            </div>
            <h2 className="mb-2 px-4 text-2xl font-bold text-center tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-solana-purple to-solana-green animate-gradient">
              Solana Timer
            </h2>
          </Link>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start gap-3 transition-all duration-300 relative overflow-hidden group tracking-wide text-lg py-6",
                      isActive 
                        ? "bg-gradient-to-r from-transparent to-[#7a37cc]/30 text-black font-medium" 
                        : "hover:bg-gradient-to-r hover:from-transparent hover:to-[#9945FF]/20 text-black/80 hover:text-black"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-solana-purple/5 to-solana-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient" />
                    <item.icon className={cn(
                      "h-6 w-6 transition-all duration-300 transform group-hover:scale-110",
                      isActive ? "text-[#7a37cc]" : "text-black/70 group-hover:text-[#7a37cc]"
                    )} />
                    <span className="relative z-10">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
} 