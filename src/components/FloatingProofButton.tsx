import Link from "next/link";
import { Shield } from "lucide-react";

export default function FloatingProofButton() {
  return (
    <Link href="/rewards-proof" prefetch={false}>
      <button
        className="fixed z-50 bottom-6 right-6 bg-gradient-to-br from-[#9945FF] to-[#14F195] shadow-xl rounded-full w-16 h-16 flex items-center justify-center animate-bounce hover:scale-110 transition-transform duration-200 border-4 border-black/40 hover:border-[#14F195]"
        aria-label="Show Reward Proof"
        style={{ boxShadow: "0 4px 32px 0 #14F19555" }}
      >
        <Shield className="w-8 h-8 text-white drop-shadow-lg" />
      </button>
    </Link>
  );
} 