"use client";
import FloatingProofButton from "@/components/FloatingProofButton";
import { usePathname } from "next/navigation";

export default function FloatingProofButtonClient() {
  const pathname = usePathname();
  if (pathname === "/rewards-proof") return null;
  return <FloatingProofButton />;
} 