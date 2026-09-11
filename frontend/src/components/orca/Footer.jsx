import React from "react";
import { Waves } from "lucide-react";

export default function Footer() {
  return (
    <footer className="section-bg border-t border-white/[0.06] py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center">
              <Waves className="h-4 w-4 text-cyan-300" />
            </div>
            <div>
              <div className="text-white font-semibold">ORCA</div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-cyan-300/70 font-mono">Ocean Intelligence Mesh</div>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-slate-400">Simulated ocean intelligence and coastal alert platform for India’s 7,500 km shoreline.</p>
        </div>
        {[
          { title: "Platform", links: ["Ocean Map", "Alerts", "Fisherman Support", "Citizen Reports"] },
          { title: "Research", links: ["Ecosystem Health", "AI Reasoning", "Data Sources", "Methodology"] },
          { title: "Community", links: ["Partners", "NGOs", "Authorities", "Contact"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-white font-semibold text-[14px]">{col.title}</div>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="text-[13px] text-slate-400 hover:text-cyan-200">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-10 flex flex-wrap items-center justify-between border-t border-white/[0.06] pt-6 text-[12px] text-slate-500 font-mono">
        <span>© 2025 ORCA · Coastal watch simulation</span>
        <span>Frontend preview · mock data</span>
      </div>
    </footer>
  );
}
