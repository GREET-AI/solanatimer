"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGrid, BookOpen, LineChart, GraduationCap, Timer } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
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
  },
  {
    name: "Tutorials",
    href: "/tutorials",
    icon: GraduationCap
  }
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 min-h-screen border-r relative overflow-hidden backdrop-blur-sm border-opacity-20", className)}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-solana-purple/5 to-solana-green/5 animate-gradient" />
      
      <div className="space-y-4 py-4 relative">
        <div className="px-3 py-2">
          <Link href="/" className="block">
            <div className="flex items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/20 to-solana-green/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500" />
              <Image
                src="/clock.gif"
                alt="Timer Logo"
                width={100}
                height={100}
                priority
                className="rounded-full relative hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h2 className="mb-2 px-4 text-2xl solana-gradient-text text-center tracking-wide">
              Learning Hub
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
                      isActive ? "bg-solana-purple/10 text-solana-purple" : "hover:bg-solana-purple/10 hover:text-solana-purple"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <item.icon className={cn(
                      "h-6 w-6 transition-colors",
                      isActive ? "text-solana-purple" : "group-hover:text-solana-purple"
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