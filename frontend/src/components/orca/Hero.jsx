import React, { useEffect, useState } from "react";
import { ArrowRight, AlertTriangle, Thermometer, Wind, Radio, ShieldCheck, Activity } from "lucide-react";
import { coastalStats as fallback } from "../../mock";
import { fetchStats } from "../../lib/orcaApi";

export default function Hero() {
  const [coastalStats, setCoastalStats] = useState(fallback);
  useEffect(() => {
    fetchStats()
      .then((s) => {
        setCoastalStats({
          networkReadiness: s.network_readiness,
          sstAnomaly: s.sst_anomaly,
          meanWind: s.mean_wind,
          lastSync: s.last_sync,
          activeAlerts: s.active_alerts,
          safeFishingZones: s.safe_fishing_zones,
          citizenReports: s.citizen_reports,
          ecosystemHealth: s.ecosystem_health,
        });
      })
      .catch(() => {});
  }, []);
  return (
    <section id="home" className="hero-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="chip"><Radio className="h-3.5 w-3.5" /> Mission console · India coastal watch</span>
            <h1 className="mt-6 font-display text-[64px] leading-[1.02] tracking-tight text-white">
              See the coast <br />
              <span className="text-cyan-300">before it changes.</span>
            </h1>
            <p className="mt-6 max-w-xl text-slate-300/85 text-[16px] leading-relaxed">
              ORCA fuses INSAT-inspired satellite observations, marine ecosystem signals, local knowledge and
              response workflows — so India’s 7,500 km coastline can respond with clarity.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="btn-primary inline-flex items-center gap-2">
                Explore My Coast <ArrowRight className="h-4 w-4" />
              </button>
              <button className="btn-ghost inline-flex items-center gap-2">
                View live alerts <AlertTriangle className="h-4 w-4 text-amber-300" />
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-[12px] text-slate-400">
              <span className="inline-flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-cyan-300" /> INSAT-inspired signal fusion</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Decision support for people</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="panel p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="section-num">COASTAL OPERATIONS</div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Good morning, India.</h3>
                </div>
                <div className="h-10 w-10 rounded-full border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-cyan-300" />
                </div>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-[12px] text-slate-400 mb-2">
                  <span>Network readiness</span>
                  <span className="text-cyan-200">{coastalStats.networkReadiness}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${coastalStats.networkReadiness}%` }} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1"><Thermometer className="h-3.5 w-3.5 text-amber-300" /> SST anomaly</div>
                  <div className="text-2xl font-semibold text-white">{coastalStats.sstAnomaly}</div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1"><Wind className="h-3.5 w-3.5 text-cyan-300" /> Mean coastal wind</div>
                  <div className="text-2xl font-semibold text-white">{coastalStats.meanWind}</div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Last simulation sync</span>
                <span className="font-mono text-slate-300">{coastalStats.lastSync}</span>
              </div>
            </div>
          </div>
        </div>

        <StatsRow coastalStats={coastalStats} />
      </div>
    </section>
  );
}

function StatsRow({ coastalStats }) {
  const stats = [
    { label: "Active coastal alerts", value: coastalStats.activeAlerts, hint: "Cyclone · Bleaching · Pollution" },
    { label: "Safe fishing zones", value: coastalStats.safeFishingZones, hint: "Across 10 coastal states" },
    { label: "Citizen reports", value: coastalStats.citizenReports, hint: "This week · verified 68%" },
    { label: "Ecosystem health score", value: `${coastalStats.ecosystemHealth}/100`, hint: "Composite index" },
  ];
  return (
    <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="panel panel-hover p-5">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{s.label}</div>
          <div className="mt-2 text-3xl font-semibold text-white">{s.value}</div>
          <div className="mt-2 flex items-center gap-2 text-[12px] text-slate-400">
            <span className="dot-live" /> {s.hint}
          </div>
        </div>
      ))}
    </div>
  );
}
