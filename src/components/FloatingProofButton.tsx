"use client";
import { Shield } from "lucide-react";
import { useState } from "react";
import ProofModal from "@/components/ProofModal";
import ProofContent from "@/app/rewards-proof/ProofContent";

export default function FloatingProofButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="fixed z-50 bottom-6 right-6 bg-gradient-to-br from-[#9945FF] to-[#14F195] shadow-xl rounded-full w-16 h-16 flex items-center justify-center animate-bounce hover:scale-110 transition-transform duration-200 border-4 border-black/40 hover:border-[#14F195]"
        aria-label="Show Reward Proof"
        style={{ boxShadow: "0 4px 32px 0 #14F19555" }}
        onClick={() => setOpen(true)}
      >
        <Shield className="w-8 h-8 text-white drop-shadow-lg" />
      </button>
      <ProofModal open={open} onClose={() => setOpen(false)}>
        <ProofContent />
      </ProofModal>
    </>
  );
} 