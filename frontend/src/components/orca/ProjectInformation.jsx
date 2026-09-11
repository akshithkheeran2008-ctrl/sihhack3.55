import React from "react";
import { Fingerprint, Database, Code2, HeartHandshake, ArrowUpRight, Info } from "lucide-react";
import { projectAreas, dataProvenance } from "./projectInformationContent";

const icons = { Fingerprint, Database, Code2, HeartHandshake };

export const ProjectInformation = () => (
  <section id="project-information" aria-labelledby="project-information-heading" data-testid="project-information-section" className="project-information py-16 md:py-24 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="project-information-heading" data-testid="project-information-heading" className="text-base md:text-lg font-semibold text-cyan-200">08 · Project information & impact</h2>
        <span data-testid="project-maturity-status" className="project-status project-tone-amber">Working prototype · not an operational warning service</span>
      </div>
      <p data-testid="project-information-intro" className="mt-5 font-display text-4xl md:text-5xl text-white leading-tight">Built with purpose. Clear about the evidence.</p>
      <p data-testid="project-information-summary" className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-slate-300">ORCA brings Indian coastal scenarios and citizen reporting into one project. Here is what it contributes, what the implementation demonstrates, and where validation is still needed.</p>

      <nav aria-label="Project information topics" className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
        {projectAreas.map((area) => (
          <a key={area.id} href={`#project-${area.id}`} data-testid={`project-topic-${area.id}-link`} className="project-link inline-flex items-center gap-2 text-sm">
            <span className="font-mono text-xs text-slate-400">{area.number}</span>{area.title}<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          </a>
        ))}
      </nav>

      <div className="mt-10 grid md:grid-cols-2 gap-5">
        {projectAreas.map((area) => {
          const Icon = icons[area.icon];
          return (
            <article id={`project-${area.id}`} key={area.id} aria-labelledby={`project-${area.id}-heading`} data-testid={`project-${area.id}-card`} className={`project-area project-tone-${area.tone}`}>
              <div className="flex items-center justify-between gap-3">
                <Icon aria-hidden="true" className="h-6 w-6" />
                <span className="font-mono text-xs text-slate-400">{area.number} / 04</span>
              </div>
              <h3 id={`project-${area.id}-heading`} data-testid={`project-${area.id}-heading`} className="mt-5 text-lg font-semibold text-white">{area.title}</h3>
              <p data-testid={`project-${area.id}-status`} className="mt-2 text-xs font-mono">{area.label}</p>
              <p data-testid={`project-${area.id}-summary`} className="mt-5 text-base font-medium leading-relaxed text-slate-100">{area.summary}</p>
              {area.points.map((point, index) => <p key={index} data-testid={`project-${area.id}-evidence-${index + 1}`} className="mt-3 text-sm leading-relaxed text-slate-300">{point}</p>)}
              <p data-testid={`project-${area.id}-limitation`} className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">{area.note}</p>
            </article>
          );
        })}
      </div>

      <div id="project-data-provenance" className="mt-14" data-testid="project-data-provenance">
        <h3 data-testid="project-data-provenance-heading" className="text-lg font-semibold text-white">Where the data comes from</h3>
        <p data-testid="project-data-provenance-description" className="mt-2 text-sm text-slate-400">Storage, source and verification are different things. This is the current state of each data stream.</p>
        <dl className="mt-6 border-t border-white/10">
          {dataProvenance.map((source) => (
            <div key={source.id} data-testid={`project-source-${source.id}`} className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 md:gap-8 py-5 border-b border-white/10">
              <dt>
                <span data-testid={`project-source-${source.id}-name`} className="block text-sm font-medium text-white">{source.name}</span>
                <span data-testid={`project-source-${source.id}-status`} className={`project-status project-tone-${source.tone} mt-2`}>{source.status}</span>
              </dt>
              <dd data-testid={`project-source-${source.id}-detail`} className="text-sm leading-relaxed text-slate-300">{source.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div data-testid="project-responsible-use-notice" role="note" className="mt-8 flex items-start gap-3 border-l-2 border-amber-300 bg-amber-300/[0.04] p-5">
        <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
        <p className="text-sm leading-relaxed text-slate-300"><strong className="text-amber-100">For learning and demonstration, not safety-critical decisions.</strong> Do not use sample conditions to decide whether to sail, swim or evacuate. Follow current official advisories and local authorities. Reports are public in this prototype; avoid personal or sensitive information. No authority notification or emergency dispatch is connected.</p>
      </div>
      <div className="mt-7 flex flex-wrap gap-6">
        <a href="#citizen-reports" data-testid="project-view-reporting-link" className="project-link inline-flex items-center gap-2 text-sm">View citizen reporting <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
        <a href="#ocean-map" data-testid="project-view-scenarios-link" className="project-link inline-flex items-center gap-2 text-sm">Explore coastal scenarios <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
      </div>
    </div>
  </section>
);