import React, { useEffect, useState } from "react";
import { ArrowRight, MapPin, Radio, Clock } from "lucide-react";
import { alerts as fallback } from "../../mock";
import { fetchAlerts, seedAlerts } from "../../lib/orcaApi";

function levelBadge(level) {
  if (level === "Critical") return "badge-crit";
  if (level === "High") return "badge-high";
  if (level === "Moderate") return "badge-mod";
  return "badge-safe";
}

export default function AlertCentre() {
  const [alerts, setAlerts] = useState(fallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await seedAlerts();
        const data = await fetchAlerts();
        if (!cancelled && Array.isArray(data) && data.length) {
          // Map backend fields to card shape
          const mapped = data.map((a) => ({
            id: a.alert_id,
            level: a.level,
            status: a.status,
            title: a.title,
            location: a.location,
            cause: a.cause,
            response: a.response,
            time: a.time,
          }));
          setAlerts(mapped);
          setLive(true);
        }
      } catch (e) {
        // fall back to mock, no user-facing error
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="alerts" className="section-bg py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-num inline-flex items-center gap-2">
          03 · COASTAL ALERT CENTRE
            <span data-testid="alerts-data-source" className="ml-2 inline-flex items-center gap-1.5 text-amber-200 normal-case tracking-normal text-[11px]">
              {live ? "Seeded examples · database-backed" : "Local demo examples"}
            </span>
        </div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">Warnings with a response attached</h2>
        <p className="mt-4 max-w-2xl text-slate-300/80">
          ORCA does not stop at a red dot. Every alert includes cause, location, timing, and the next practical action.
        </p>
        <p data-testid="alerts-demo-notice" className="mt-3 max-w-2xl text-sm leading-relaxed text-amber-200/90">Illustrative scenarios, not current warnings. No official alert feed is connected. Follow current official advisories for safety decisions.</p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {alerts.map((a) => (
            <div key={a.id} data-testid={`alert-${a.id}-card`} className="panel panel-hover p-6">
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
                <span>{String(a.id).toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a href="#project-data-provenance" data-testid="alerts-data-provenance-link" className="btn-ghost inline-flex items-center gap-2">
            About these alert examples <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
