import React, { useMemo, useState } from "react";
import { Download, Save, Anchor, ArrowRight, Wind, Waves as WavesIcon, Clock, MapPin } from "lucide-react";
import { districts } from "../../mock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../../hooks/use-toast";

function advisoryColor(level) {
  if (level === "danger") return { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)", text: "#fca5a5" };
  if (level === "warning") return { bg: "rgba(234,179,8,0.10)", border: "rgba(234,179,8,0.35)", text: "#fde68a" };
  return { bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.35)", text: "#6ee7b7" };
}

export default function Fisherman() {
  const [selectedId, setSelectedId] = useState("tuticorin");
  const [saved, setSaved] = useState([]);
  const { toast } = useToast();
  const d = useMemo(() => districts.find((x) => x.id === selectedId), [selectedId]);
  const color = advisoryColor(d.advisoryLevel);

  const onSave = () => {
    if (saved.find((x) => x.id === d.id)) return;
    setSaved([...saved, d]);
    toast({ title: "Advisory saved offline", description: `${d.name} is now available in your browser.` });
  };

  return (
    <section id="fisherman-support" className="section-bg py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-num">04 · FISHERMAN SUPPORT</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">A safer answer before you sail</h2>
        <p className="mt-4 max-w-2xl text-slate-300/80">
          Choose a coastal district and get a simple, visual sea-condition brief for the next trip. Covering 10
          districts across India’s coast.
        </p>

        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 panel p-6">
            <div className="section-num">DISTRICT ADVISORY</div>
            <div className="mt-4">
              <div className="text-[12px] text-slate-400 mb-2">Where are you sailing from?</div>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="orca-select-trigger h-11">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((dd) => (
                    <SelectItem key={dd.id} value={dd.id}>{dd.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-5 rounded-xl p-5" style={{ background: color.bg, border: `1px solid ${color.border}` }}>
              <div className="text-2xl font-semibold" style={{ color: color.text }}>{d.advisory}</div>
              <p className="mt-2 text-[13px] text-slate-200/90">{d.note}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric icon={<WavesIcon className="h-3.5 w-3.5 text-cyan-300" />} label="Wave height" value={d.wave} />
              <Metric icon={<Wind className="h-3.5 w-3.5 text-cyan-300" />} label="Wind speed" value={d.wind} />
              <Metric icon={<Clock className="h-3.5 w-3.5 text-cyan-300" />} label="Fishing window" value={d.window} />
              <Metric icon={<Anchor className="h-3.5 w-3.5 text-cyan-300" />} label="PFZ signal" value={d.pfz} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={onSave} className="btn-primary inline-flex items-center gap-2 py-2 px-4 text-[13px]">
                <Save className="h-4 w-4" /> Save offline
              </button>
              <button className="btn-ghost inline-flex items-center gap-2 py-2 px-4 text-[13px]">
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 panel p-6">
            <div className="flex items-center justify-between">
              <div className="section-num inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> SAFE ROUTE MAP</div>
              <div className="font-mono text-[11px] text-slate-500">{d.lat.toFixed(2)}°N · {d.lng.toFixed(2)}°E</div>
            </div>
            <RouteMap district={d} />
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-slate-400">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-300" /> Recommended route</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Fishing zone</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-400" /> Shoreline</span>
            </div>
          </div>
        </div>

        <div className="mt-6 panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-num">LOW-CONNECTIVITY KIT</div>
              <h3 className="mt-2 text-xl font-semibold text-white">Saved offline advisories</h3>
              <p className="mt-1 text-[13px] text-slate-400">Save a district brief and it will stay available in this browser.</p>
            </div>
            <div className="text-[12px] text-slate-400 font-mono">{saved.length} saved</div>
          </div>
          {saved.length > 0 && (
            <div className="mt-4 grid md:grid-cols-3 gap-3">
              {saved.map((s) => (
                <div key={s.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="text-white text-[14px] font-semibold">{s.name}</div>
                  <div className="mt-1 text-[12px] text-slate-400">{s.advisory} · Wave {s.wave} · Wind {s.wind}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <button className="btn-ghost inline-flex items-center gap-2">Open fisherman console <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">{icon} {label}</div>
      <div className="mt-1 text-[15px] font-semibold text-white">{value}</div>
    </div>
  );
}

function RouteMap({ district }) {
  return (
    <div className="mt-4 relative aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.06]">
      <div className="absolute inset-0" style={{ background: "radial-gradient(600px 240px at 20% 90%, rgba(34,211,238,0.10), transparent 60%), linear-gradient(180deg, #06121f 0%, #050a15 100%)" }} />
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <svg viewBox="0 0 800 450" className="absolute inset-0 h-full w-full">
        {/* Shoreline */}
        <path d="M0,380 C120,340 220,410 340,360 S560,300 800,340 L800,450 L0,450 Z" fill="rgba(11,33,54,0.9)" stroke="rgba(148,163,184,0.35)" strokeWidth="1.2" />
        {/* Route (dashed) */}
        <path d="M120,380 C220,300 320,260 440,220 S640,180 720,130" stroke="#67e8f9" strokeWidth="2" strokeDasharray="6 6" fill="none" />
        {/* Fishing zone */}
        <circle cx="540" cy="200" r="46" fill="rgba(52,211,153,0.14)" stroke="rgba(52,211,153,0.6)" />
        <text x="506" y="204" fill="#6ee7b7" fontSize="11" fontFamily="monospace">PFZ · ACTIVE</text>
        {/* Harbour */}
        <circle cx="120" cy="380" r="5" fill="#67e8f9" />
        <text x="130" y="376" fill="#e6edf7" fontSize="11">Harbour</text>
      </svg>
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{district.lat.toFixed(2)}°N · {district.lng.toFixed(2)}°E</span>
        <span>Potential fishing zone and return route · simulated telemetry</span>
      </div>
    </div>
  );
}
