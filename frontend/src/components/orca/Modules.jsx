import React from "react";
import { ArrowRight, Satellite, Fish, AlertTriangle, Anchor, Camera, BrainCircuit } from "lucide-react";
import { modules } from "../../mock";

const iconMap = { Satellite, Fish, AlertTriangle, Anchor, Camera, BrainCircuit };

export default function Modules() {
  return (
    <section id="alerts" className="section-bg py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-num">02 · MISSION MODULES</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">One signal. Many ways to act.</h2>
        <p className="mt-4 max-w-2xl text-slate-300/80">
          Open any console to move from raw observation to a clear decision. Every module is built for a different coastal role.
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => {
            const Icon = iconMap[m.icon] || Satellite;
            return (
              <div key={m.idx} className="panel panel-hover p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 font-mono text-[11px] text-slate-500">{m.idx}</div>
                <div className="h-11 w-11 rounded-xl border border-cyan-400/25 bg-cyan-400/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="section-num mt-4">{m.tag.toUpperCase()}</div>
                <h3 className="mt-1 text-xl font-semibold text-white">{m.title}</h3>
                <p className="mt-2 text-[14px] text-slate-300/80 leading-relaxed">{m.desc}</p>
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <button className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-[13px]">
                    Open console <ArrowRight className="h-4 w-4" />
                  </button>
                  <a href="#" className="text-[12px] text-slate-500 hover:text-slate-300">Full view</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
