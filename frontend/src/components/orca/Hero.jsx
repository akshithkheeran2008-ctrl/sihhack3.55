import React, { useEffect, useState } from "react";
import { ArrowRight, AlertTriangle, Thermometer, Wind, Radio, ShieldCheck, Activity } from "lucide-react";
import { coastalStats as fallback } from "../../mock";
import { fetchStats } from "../../lib/orcaApi";

export default function Hero() {
  const [coastalStats, setCoastalStats] = useState(fallback);
  const [statsStatus, setStatsStatus] = useState("loading");
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
        setStatsStatus("loaded");
      })
      .catch(() => setStatsStatus("unavailable"));
  }, []);
  return (
    <section id="home" className="hero-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="chip"><Radio className="h-3.5 w-3.5" /> Mission console · India coastal watch</span>
            <h1 data-testid="hero-heading" className="mt-6 font-display text-5xl sm:text-6xl leading-[1.02] text-white">
              See the coast <br />
              <span className="text-cyan-300">before it changes.</span>
            </h1>
            <p data-testid="hero-project-description" className="mt-6 max-w-xl text-slate-300/85 text-[16px] leading-relaxed">
              ORCA pairs simulated marine conditions with a working citizen-report workflow for India’s
              coastal regions — exploring how local observations could support clearer coastal decisions.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#ocean-map" data-testid="hero-explore-coast-link" className="btn-primary inline-flex items-center gap-2">
                Explore My Coast <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#alerts" data-testid="hero-view-alerts-link" className="btn-ghost inline-flex items-center gap-2">
                View demo alerts <AlertTriangle className="h-4 w-4 text-amber-300" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-[12px] text-slate-400">
              <span data-testid="hero-simulation-label" className="inline-flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-cyan-300" /> Simulated ocean signals</span>
              <a href="#project-information" data-testid="hero-project-information-link" className="project-link inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Project evidence & impact</a>
            </div>
            <p data-testid="hero-safety-notice" className="mt-5 text-xs leading-relaxed text-amber-200/90">Demonstration only. Not a live warning service or a substitute for official marine advisories.</p>
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
                  <span>Network readiness · sample</span>
                  <span data-testid="hero-network-readiness" className="text-cyan-200">{coastalStats.networkReadiness}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${coastalStats.networkReadiness}%` }} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1"><Thermometer className="h-3.5 w-3.5 text-amber-300" /> SST anomaly</div>
                  <div data-testid="hero-sst-anomaly" className="text-xl sm:text-2xl font-semibold text-white">{coastalStats.sstAnomaly}</div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1"><Wind className="h-3.5 w-3.5 text-cyan-300" /> Mean coastal wind</div>
                  <div data-testid="hero-mean-wind" className="text-xl sm:text-2xl font-semibold text-white">{coastalStats.meanWind}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 items-center justify-between text-[11px] text-slate-400">
                <span>Last simulation sync</span>
                <span data-testid="hero-simulation-timestamp" className="font-mono text-slate-300">{coastalStats.lastSync}</span>
              </div>
            </div>
          </div>
        </div>

        <StatsRow coastalStats={coastalStats} statsStatus={statsStatus} />
      </div>
    </section>
  );
}

function StatsRow({ coastalStats, statsStatus }) {
  const stats = [
    { id: "alerts", label: "Demo coastal alerts", value: coastalStats.activeAlerts, hint: "Seeded example scenarios" },
    { id: "fishing-zones", label: "Sample fishing zones", value: coastalStats.safeFishingZones, hint: "Simulated · not navigation data" },
    { id: "reports", label: "Citizen reports", value: statsStatus === "loaded" ? coastalStats.citizenReports : "—", hint: statsStatus === "loaded" ? "All stored records · unverified" : statsStatus === "loading" ? "Loading stored report count…" : "Report count unavailable" },
    { id: "ecosystem", label: "Ecosystem health score", value: `${coastalStats.ecosystemHealth}/100`, hint: "Illustrative composite score" },
  ];
  return (
    <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="panel panel-hover p-5">
          <div data-testid={`hero-stat-${s.id}-label`} className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{s.label}</div>
          <div data-testid={`hero-stat-${s.id}-value`} className="mt-2 text-3xl font-semibold text-white">{s.value}</div>
          <div data-testid={`hero-stat-${s.id}-source`} className="mt-2 flex items-center gap-2 text-[12px] text-slate-400">
            {s.hint}
          </div>
        </div>
      ))}
    </div>
  );
}
