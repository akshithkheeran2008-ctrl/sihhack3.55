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
          <p data-testid="footer-project-description" className="mt-4 text-[13px] text-slate-400">India-focused coastal demonstration with simulated ocean conditions and database-backed citizen reporting.</p>
        </div>
        {[
          { title: "Platform", links: [["Ocean Map", "ocean-map"], ["Alerts", "alerts"], ["Fisherman Support", "fisherman-support"], ["Citizen Reports", "citizen-reports"]] },
          { title: "Project", links: [["Project Information", "project-information"], ["Content Originality", "project-originality"], ["Data Sources", "project-data-provenance"], ["Data Quality", "project-data-quality"]] },
          { title: "People & Purpose", links: [["Implementation Skills", "project-implementation"], ["Impact & Usefulness", "project-impact"], ["Collaboration Hub", "collaboration-hub"], ["Demo Reasoning", "ai-assistant"]] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-white font-semibold text-[14px]">{col.title}</div>
            <ul className="mt-3 space-y-2">
              {col.links.map(([label, target]) => (
                <li key={target}><a data-testid={`footer-${target}-link`} href={`#${target}`} className="project-link text-[13px]">{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-10 flex flex-wrap gap-3 items-center justify-between border-t border-white/[0.06] pt-6 text-[12px] text-slate-500 font-mono">
        <span>ORCA · Coastal watch prototype</span>
        <span data-testid="footer-data-status">Simulated conditions · unverified citizen reports</span>
      </div>
    </footer>
  );
}
