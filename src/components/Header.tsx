import { Activity, Shield, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-[#2C2C2E] bg-[#0A0A0A] px-6 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D4AF37]/30 bg-gradient-to-br from-[#121212] to-[#1A1A1A]">
            <span className="font-mono text-lg font-bold text-[#D4AF37] tracking-wider">I&A</span>
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold tracking-widest text-white uppercase sm:text-2xl">
              Iron <span className="font-light text-[#D4AF37]">&amp;</span> Aesthetic
            </h1>
            <p className="text-xs font-medium tracking-wider text-[#8E8E93] uppercase">
              Elite Somatic Optimization Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-[#2C2C2E] bg-[#121212] px-3.5 py-1.5 md:flex">
            <Shield className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="font-mono text-[10px] font-semibold text-white tracking-widest uppercase">
              Clinical Grade Secure
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3.5 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-mono text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase">
              Elite Coach Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
