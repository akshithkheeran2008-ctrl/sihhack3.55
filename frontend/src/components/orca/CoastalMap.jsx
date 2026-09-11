import React, { useState } from "react";
import { MapPin, ArrowRight, Thermometer, Waves as WavesIcon, Cloud, Users } from "lucide-react";
import { regions } from "../../mock";

const legend = [
  { label: "Safe", color: "#34d399" },
  { label: "Moderate", color: "#fbbf24" },
  { label: "High", color: "#fb923c" },
  { label: "Critical", color: "#f87171" },
];

function riskToColor(risk) {
  if (risk === "Safe") return "#34d399";
  if (risk === "Moderate") return "#fbbf24";
  if (risk === "High") return "#fb923c";
  return "#f87171";
}

// Approximate positional mapping for India outline (percentage-based)
const mapPositions = {
  "gulf-of-mannar": { top: "82%", left: "52%" },
  "odisha-coast": { top: "48%", left: "70%" },
  "mumbai-coast": { top: "52%", left: "25%" },
  "lakshadweep": { top: "78%", left: "22%" },
  "sundarbans": { top: "42%", left: "80%" },
  "kochi-coast": { top: "78%", left: "38%" },
  "visakhapatnam": { top: "58%", left: "64%" },
  "goa-coast": { top: "62%", left: "28%" },
  "kutch-coast": { top: "32%", left: "18%" },
  "chennai-coast": { top: "72%", left: "58%" },
  "puducherry-coast": { top: "75%", left: "56%" },
  "mangalore-coast": { top: "70%", left: "32%" },
  "andaman-islands": { top: "78%", left: "90%" },
  "paradip-coast": { top: "46%", left: "72%" },
  "diu-coast": { top: "40%", left: "16%" },
  "kanyakumari": { top: "88%", left: "48%" },
};

export default function CoastalMap() {
  const [activeId, setActiveId] = useState("gulf-of-mannar");
  const active = regions.find((r) => r.id === activeId) || regions[0];

  return (
    <section id="ocean-map" className="section-bg py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-num">01 · COASTAL INTELLIGENCE</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">A living map of India’s shore</h2>
        <p className="mt-4 max-w-2xl text-slate-300/80">
          Select a coastal region to open its current health signal, marine conditions, and a recommended next move.
          16+ regions monitored across the Arabian Sea, Bay of Bengal, and Indian Ocean island chains.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveId(r.id)}
              className={`region-pill ${activeId === r.id ? "active" : ""}`}
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 panel p-6 relative overflow-hidden">
            <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
            <IndiaMap activeId={activeId} onSelect={setActiveId} />
            <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px] text-slate-400">
              <span className="section-num">HEALTH LEGEND</span>
              {legend.map((l) => (
                <span key={l.label} className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color, boxShadow: `0 0 10px ${l.color}` }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="section-num inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> REGIONAL DASHBOARD</div>
                <h3 className="mt-2 text-2xl font-semibold text-white">{active.name}</h3>
                <div className="text-[12px] text-slate-400 mt-1">{active.state} · {active.lat.toFixed(2)}°N · {active.lng.toFixed(2)}°E</div>
              </div>
              <span className={`text-[12px] px-3 py-1 rounded-full ${active.risk === "Critical" ? "badge-crit" : active.risk === "High" ? "badge-high" : active.risk === "Moderate" ? "badge-mod" : "badge-safe"}`}>{active.risk} Risk</span>
            </div>

            <p className="mt-3 text-[13px] text-slate-400">Signal blend from simulated satellite passes and community observations.</p>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="section-num">ECOSYSTEM HEALTH</div>
                <div className="mt-1 text-5xl font-semibold text-white">{active.ecosystemHealth}<span className="text-lg text-slate-500">/100</span></div>
              </div>
              <div className="relative h-24 w-24 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(${riskToColor(active.risk)} ${active.ecosystemHealth * 3.6}deg, rgba(120,156,200,.12) 0deg)` }}>
                <div className="absolute inset-1 rounded-full bg-[#0a1626]" />
                <span className="relative text-[11px] uppercase tracking-widest" style={{ color: riskToColor(active.risk) }}>{active.risk}</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <MiniStat icon={<Thermometer className="h-3.5 w-3.5 text-amber-300" />} label="Sea temp" value={active.sst} />
              <MiniStat icon={<WavesIcon className="h-3.5 w-3.5 text-cyan-300" />} label="Wave height" value={active.wave} />
              <MiniStat icon={<Cloud className="h-3.5 w-3.5 text-sky-300" />} label="Weather" value={active.weather} />
            </div>

            <div className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.03] p-4">
              <div className="section-num">RECOMMENDED ACTION</div>
              <div className="mt-2 text-[14px] text-slate-100">{active.action}</div>
            </div>

            <div className="mt-5">
              <div className="section-num inline-flex items-center gap-2"><Users className="h-3.5 w-3.5" /> RECENT CITIZEN REPORTS</div>
              <ul className="mt-2 space-y-1.5">
                {active.reports.map((r, i) => (
                  <li key={i} className="text-[13px] text-slate-300 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> {r}
                  </li>
                ))}
              </ul>
            </div>

            <button className="mt-6 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-[13px]">
              Open regional console <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Region strip */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {["gulf-of-mannar", "odisha-coast", "mumbai-coast"].map((id) => {
            const r = regions.find((x) => x.id === id);
            return (
              <button key={id} onClick={() => setActiveId(id)} className="panel panel-hover p-5 text-left">
                <div className="flex items-center justify-between">
                  <div className="text-white font-semibold">{r.name}</div>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: riskToColor(r.risk), boxShadow: `0 0 10px ${riskToColor(r.risk)}` }} />
                </div>
                <div className="mt-1 text-[13px] text-slate-400">{r.tag}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">{icon} {label}</div>
      <div className="mt-1 text-sm font-semibold text-white truncate">{value}</div>
    </div>
  );
}

function IndiaMap({ activeId, onSelect }) {
  return (
    <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="landFill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#0b2136" />
            <stop offset="100%" stopColor="#0a1a2a" />
          </linearGradient>
        </defs>
        {/* Stylized India outline */}
        <path
          d="M120,60 L180,50 L230,55 L270,70 L300,95 L330,130 L340,170 L320,200 L315,235 L305,265 L290,295 L275,325 L255,355 L235,385 L210,420 L185,455 L165,475 L150,455 L130,415 L115,380 L100,345 L90,305 L85,270 L80,235 L85,200 L95,165 L100,130 L110,95 Z"
          fill="url(#landFill)"
          stroke="rgba(103,232,249,0.25)"
          strokeWidth="1.2"
        />
        {/* Lakshadweep dots */}
        <circle cx="55" cy="390" r="2" fill="rgba(103,232,249,0.35)" />
        <circle cx="48" cy="400" r="1.6" fill="rgba(103,232,249,0.35)" />
        {/* Andaman archipelago */}
        <ellipse cx="370" cy="400" rx="6" ry="20" fill="rgba(103,232,249,0.18)" />
      </svg>

      {regions.map((r) => {
        const pos = mapPositions[r.id];
        if (!pos) return null;
        const color = riskToColor(r.risk);
        const isActive = activeId === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className="map-dot"
            style={{ top: pos.top, left: pos.left, color, transform: isActive ? "scale(1.25)" : "scale(1)" }}
            aria-label={r.name}
          >
            <span className="absolute inset-0 rounded-full" style={{ background: color, boxShadow: `0 0 14px ${color}` }} />
            {isActive && <span className="ring" />}
          </button>
        );
      })}

      {/* Callout for active */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono">SIMULATED SATELLITE OVERLAY</span>
        <span className="font-mono">17°N · 78°E</span>
      </div>
    </div>
  );
}
