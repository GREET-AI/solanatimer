import { useEffect } from "react";
import { X } from "lucide-react";

export default function ProofModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl mx-auto bg-black rounded-2xl shadow-2xl border border-[#14F195]/30 p-0 overflow-hidden animate-pop-in">
        <button
          className="absolute top-4 right-4 z-10 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform border-2 border-black/40 hover:border-[#9945FF]"
          aria-label="Close Proof Modal"
          onClick={onClose}
        >
          <X className="w-7 h-7 text-white" />
        </button>
        <div className="p-0 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 