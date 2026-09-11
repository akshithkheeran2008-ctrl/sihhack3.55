import React from "react";
import { Anchor, Users, Microscope, Handshake, ShieldCheck } from "lucide-react";
import { roles, workflow } from "../../mock";

const iconMap = { Anchor, Users, Microscope, Handshake, ShieldCheck };

export default function Collaboration() {
  return (
    <section id="collaboration-hub" className="section-bg py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-num">07 · COLLABORATION HUB</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">A coastline is safer together</h2>
        <p className="mt-4 max-w-2xl text-slate-300/80">
          ORCA creates a shared operational language across the people who see, study, protect, and govern the shore.
        </p>

        <div className="mt-10 grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {roles.map((r) => {
            const Icon = iconMap[r.icon] || Users;
            return (
              <div key={r.title} className="panel panel-hover p-5">
                <div className="h-10 w-10 rounded-xl border border-cyan-400/25 bg-cyan-400/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-cyan-300" />
                </div>
                <h3 className="mt-4 text-white font-semibold">{r.title}</h3>
                <p className="mt-1 text-[13px] text-slate-400">{r.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-num">SIGNAL TO ACTION</div>
              <h3 className="mt-2 text-xl font-semibold text-white">Report workflow</h3>
              <p className="text-[12px] text-slate-400 mt-1 font-mono">DEMO PROTOCOL · 5 STEPS</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {workflow.map((w, i) => (
              <React.Fragment key={w}>
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 font-mono text-[13px]">{i + 1}</span>
                  <span className="text-[14px] text-slate-200">{w}</span>
                </div>
                {i < workflow.length - 1 && <span className="hidden md:inline-block h-px w-10 bg-cyan-400/30" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
