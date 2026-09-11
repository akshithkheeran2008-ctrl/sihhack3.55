import React from "react";
import { ArrowRight, MapPin, Radio, Clock } from "lucide-react";
import { alerts } from "../../mock";

function levelBadge(level) {
  if (level === "Critical") return "badge-crit";
  if (level === "High") return "badge-high";
  if (level === "Moderate") return "badge-mod";
  return "badge-safe";
}

export default function AlertCentre() {
  return (
    <section className="section-bg py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-num">03 · COASTAL ALERT CENTRE</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">Warnings with a response attached</h2>
        <p className="mt-4 max-w-2xl text-slate-300/80">
          ORCA does not stop at a red dot. Every alert includes cause, location, timing, and the next practical action.
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {alerts.map((a) => (
            <div key={a.id} className="panel panel-hover p-6">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] px-2.5 py-1 rounded-full ${levelBadge(a.level)}`}>{a.level}</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Radio className="h-3 w-3 text-cyan-300" /> {a.status}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">{a.title}</h3>
              <div className="mt-1 text-[13px] text-slate-400 inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {a.location}
              </div>
              <p className="mt-3 text-[13px] text-slate-300/85">{a.cause}</p>
              <div className="hair my-4" />
              <div className="section-num">SUGGESTED RESPONSE</div>
              <p className="mt-1 text-[13px] text-slate-200">{a.response}</p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> {a.time}</span>
                <span>ALERT-{a.id.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button className="btn-ghost inline-flex items-center gap-2">
            Open full alert centre <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
