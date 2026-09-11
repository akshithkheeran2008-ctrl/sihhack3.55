import React, { useState } from "react";
import { Waves, Menu, X } from "lucide-react";

const navItems = ["Home", "Ocean Map", "Alerts", "Fisherman Support", "Citizen Reports", "AI Assistant", "Collaboration Hub"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#050a15]/95 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-4">
        <a href="#home" data-testid="nav-brand-link" onClick={() => setOpen(false)} className="orca-nav-link flex items-center gap-2 shrink-0">
          <span className="h-8 w-8 rounded-lg border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center"><Waves aria-hidden="true" className="h-4 w-4 text-cyan-300" /></span>
          <span className="leading-none"><span className="block text-white font-semibold">ORCA</span><span className="hidden sm:block text-[9px] uppercase text-cyan-300/70 font-mono mt-1">Ocean Intelligence Mesh</span></span>
        </a>
        <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-4">
          {navItems.map((item) => {
            const slug = item.toLowerCase().replace(/\s+/g, "-");
            return <a key={slug} href={`#${slug}`} data-testid={`nav-${slug}-link`} className="orca-nav-link text-xs text-slate-300 hover:text-cyan-200 transition-colors">{item}</a>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#project-information" data-testid="nav-project-information-link" onClick={() => setOpen(false)} className="orca-nav-link btn-ghost text-xs py-2 px-3 whitespace-nowrap">Project info</a>
          <button type="button" data-testid="nav-mobile-menu-button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)} className="orca-nav-link xl:hidden p-2 text-cyan-200 hover:bg-white/5 rounded-md transition-colors">
            {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" data-testid="nav-mobile-menu" aria-label="Mobile navigation" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} className="xl:hidden border-t border-white/10 px-6 py-4 grid sm:grid-cols-2 gap-1">
        {navItems.map((item) => {
          const slug = item.toLowerCase().replace(/\s+/g, "-");
          return <a key={slug} href={`#${slug}`} data-testid={`nav-mobile-${slug}-link`} onClick={() => setOpen(false)} className="orca-nav-link py-2 text-sm text-slate-300 hover:text-cyan-200 transition-colors">{item}</a>;
        })}
      </nav>}
    </header>
  );
}