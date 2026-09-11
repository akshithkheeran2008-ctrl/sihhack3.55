import React, { useState } from "react";
import { BrainCircuit, ArrowRight } from "lucide-react";
import { reasoningSteps } from "../../mock";

const tabs = ["Ask About a Region", "Ecosystem Risk Analysis", "Recommended Action", "Emergency Contact"];

export default function Reasoning() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  return (
    <section id="ai-assistant" className="section-bg py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-num">06 · REASONING ENGINE</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">Not just a warning. A why.</h2>
        <p className="mt-4 max-w-2xl text-slate-300/80">
          ORCA turns a noisy ocean signal into an explanation people can trust and teams can act on.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActive(i)} className={`region-pill ${active === i ? "active" : ""}`}>{t}</button>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="section-num">GULF OF MANNAR</div>
                <h3 className="mt-1 text-xl font-semibold text-white">Explainable risk synthesis</h3>
                <div className="mt-1 text-[12px] text-slate-500 font-mono">09:42 IST · Simulated inference</div>
              </div>
              <span className="text-[12px] px-3 py-1 rounded-full badge-high">High risk</span>
            </div>

            <ol className="mt-6 space-y-4">
              {reasoningSteps.map((s) => (
                <li key={s.n} className="flex items-start gap-4">
                  <span className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 font-mono text-[12px]">{s.n}</span>
                  <div>
                    <div className="text-white font-semibold">{s.title}</div>
                    <p className="text-[13px] text-slate-300/85 mt-0.5">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.03] p-4">
              <div className="section-num">RECOMMENDED ACTION</div>
              <p className="mt-2 text-[14px] text-slate-100">Issue an advisory for fishermen, inspect local water quality, and alert marine conservation teams.</p>
            </div>
          </div>

          <div className="lg:col-span-5 panel p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border border-cyan-400/25 bg-cyan-400/10 flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-cyan-300" />
              </div>
              <div>
                <div className="text-white font-semibold">Ask ORCA about a region</div>
                <div className="text-[12px] text-slate-400">Demo prompt · no live LLM connected</div>
              </div>
            </div>
            <div className="mt-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Why is coral in Gulf of Mannar at risk?"
                className="w-full h-12 rounded-md bg-[#0a1626] border border-cyan-400/15 px-3 text-[14px] text-slate-100 focus:outline-none focus:border-cyan-400/60"
              />
              <button className="mt-3 btn-primary inline-flex items-center gap-2 py-2 px-4 text-[13px]">
                Ask ORCA <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="hair my-5" />
            <div className="space-y-3">
              {["Explain the +2.1°C SST spike this week","Which districts need a fisherman advisory today?","Summarize Sundarbans mangrove health"].map((p, i) => (
                <button key={i} onClick={() => setQuery(p)} className="w-full text-left text-[13px] text-slate-300/90 hover:text-cyan-200 border border-white/[0.06] rounded-xl px-4 py-3 hover:border-cyan-400/40 transition-colors">
                  “{p}”
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
