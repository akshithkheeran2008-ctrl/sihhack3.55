import React from "react";
import { Waves, Circle } from "lucide-react";

const navItems = [
  "Home",
  "Ocean Map",
  "Alerts",
  "Fisherman Support",
  "Citizen Reports",
  "AI Assistant",
  "Collaboration Hub",
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#050a15]/75 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-lg border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center">
            <Waves className="h-4 w-4 text-cyan-300" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
          </div>
          <div className="leading-none">
            <div className="text-white font-semibold tracking-wide">ORCA</div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-cyan-300/70 font-mono mt-0.5">Ocean Intelligence Mesh</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[13px] text-slate-300/85 hover:text-cyan-200 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-2 text-[12px] text-emerald-300/90">
            <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
            Simulation live
          </span>
          <button className="btn-ghost text-[13px] py-2 px-4">Sign in with Google</button>
        </div>
      </div>
    </header>
  );
}
