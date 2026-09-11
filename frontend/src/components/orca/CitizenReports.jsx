import React, { useEffect, useState } from "react";
import { Camera, Upload, MapPin, AlertTriangle, Check, RefreshCw, ArrowRight } from "lucide-react";
import { regions, issueTypes } from "../../mock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../../hooks/use-toast";
import { createReport, fetchReports, advanceReport } from "../../lib/orcaApi";

const WORKFLOW = ["Reported", "AI Analyzed", "Verified", "Action Started", "Resolved"];

function urgencyBadge(u) {
  if (u === "Critical") return "badge-crit";
  if (u === "High") return "badge-high";
  if (u === "Medium") return "badge-mod";
  return "badge-safe";
}

export default function CitizenReports() {
  const [location, setLocation] = useState("gulf-of-mannar");
  const [issue, setIssue] = useState("Plastic Waste");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [reports, setReports] = useState([]);
  const { toast } = useToast();

  const loadReports = async () => {
    try {
      const data = await fetchReports();
      setReports(data.slice(0, 6));
    } catch (e) {}
  };

  useEffect(() => {
    loadReports();
  }, []);

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const regionName = regions.find((r) => r.id === location)?.name || location;
      const created = await createReport({
        region_id: location,
        region_name: regionName,
        issue_type: issue,
        description: desc,
        date,
      });
      toast({
        title: `Report submitted · ${created.report_id}`,
        description: `Urgency: ${created.urgency} · Saved to the public demo workflow. No authority has been notified.`,
      });
      setDesc("");
      setImage(null);
      await loadReports();
    } catch (err) {
      toast({ title: "Submission failed", description: "Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const onAdvance = async (reportId) => {
    try {
      const updated = await advanceReport(reportId);
      toast({ title: `${updated.report_id} → ${updated.status}` });
      await loadReports();
    } catch (e) {}
  };

  return (
    <section id="citizen-reports" className="section-bg py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="section-num">05 · CITIZEN REPORTS</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">Your observation is a coastal sensor</h2>
          <p data-testid="report-collection-description" className="mt-4 text-slate-300/80">
            Describe a coastal observation and receive a traceable ID. Report text and workflow status are stored in MongoDB; optional photos are local previews only and are not saved.
          </p>
          <p data-testid="report-privacy-notice" className="mt-3 text-sm leading-relaxed text-amber-200/90">Reports are public and unverified. Do not include personal or sensitive information. Submitting does not notify authorities or emergency services.</p>

          <ol className="mt-8 space-y-4">
            {["Share the location and signal type.", "ORCA classifies urgency using rule-based reasoning.", "Your observation receives a traceable report ID (ORC-XXXX)."].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="h-8 w-8 flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 font-mono text-[12px]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[14px] text-slate-200 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-7 min-w-0 panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Create a field report</h3>
              <p className="text-[12px] text-slate-400 mt-1">Live · saved to MongoDB with traceable ID</p>
            </div>
            <div className="h-10 w-10 rounded-xl border border-cyan-400/25 bg-cyan-400/10 flex items-center justify-center">
              <Camera className="h-4 w-4 text-cyan-300" />
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="report-location" className="text-[12px] text-slate-400">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="report-location" data-testid="report-location-select" className="orca-select-trigger h-11 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent data-testid="report-location-options">
                  {regions.map((r) => <SelectItem data-testid={`report-location-${r.id}-option`} key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="report-issue" className="text-[12px] text-slate-400">Issue type</label>
              <Select value={issue} onValueChange={setIssue}>
                <SelectTrigger id="report-issue" data-testid="report-issue-select" className="orca-select-trigger h-11 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent data-testid="report-issue-options">
                  {issueTypes.map((t) => <SelectItem data-testid={`report-issue-${t.toLowerCase().replace(/\s+/g, "-")}-option`} key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="report-date" className="text-[12px] text-slate-400">Date (optional)</label>
              <input
                id="report-date" data-testid="report-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full h-11 rounded-md bg-[#0a1626] border border-cyan-400/15 px-3 text-[14px] text-slate-100 focus:outline-none focus:border-cyan-400/60"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="report-description" className="text-[12px] text-slate-400">Description (optional)</label>
              <textarea
                id="report-description" data-testid="report-description-input"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="Describe what you observed, when, and any nearby landmarks."
                className="mt-1 w-full rounded-md bg-[#0a1626] border border-cyan-400/15 px-3 py-2 text-[14px] text-slate-100 focus:outline-none focus:border-cyan-400/60"
              />
            </div>
            <div className="md:col-span-2">
              <p data-testid="report-image-storage-notice" className="text-[12px] text-slate-400">Image preview (optional · not uploaded or saved)</p>
              <div className="mt-1 flex items-center gap-3">
                <label data-testid="report-image-choose-button" className="btn-ghost inline-flex items-center gap-2 py-2 px-4 text-[13px] cursor-pointer">
                  <Upload className="h-4 w-4" /> Choose a shoreline image
                  <input data-testid="report-image-input" type="file" accept="image/*" onChange={onImage} className="sr-only" />
                </label>
                {image && <img data-testid="report-image-preview" src={image} alt="Local shoreline preview" className="h-16 w-24 object-contain rounded-md border border-white/10" />}
              </div>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button data-testid="report-submit-button" type="submit" disabled={busy} className="btn-primary inline-flex items-center gap-2 disabled:opacity-70">
                {busy ? <><RefreshCw className="h-4 w-4 animate-spin" /> Submitting…</> : <><AlertTriangle className="h-4 w-4" /> Submit citizen report</>}
              </button>
              <span className="text-[12px] text-slate-400 inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-cyan-300" /> Traceable ID assigned by server.</span>
            </div>
          </form>
        </div>

        {/* Live reports table */}
        <div className="lg:col-span-12 min-w-0 panel p-6">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div>
              <div className="section-num">SIGNAL TO ACTION · LIVE</div>
              <h3 className="mt-2 text-xl font-semibold text-white">Latest citizen reports</h3>
              <p data-testid="report-workflow-disclaimer" className="text-[12px] text-slate-400 mt-1 max-w-2xl leading-relaxed">Stored in MongoDB · manually advanced demo stages. “AI Analyzed”, “Verified” and “Resolved” do not establish actual analysis, independent review or real-world resolution.</p>
            </div>
            <button data-testid="report-refresh-button" onClick={loadReports} className="btn-ghost inline-flex items-center gap-2 py-2 px-4 text-[13px]">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>

          {reports.length === 0 ? (
            <div data-testid="reports-empty-state" className="mt-6 rounded-xl border border-dashed border-white/[0.08] p-8 text-center text-slate-400 text-[13px]">
              No reports yet. Submit one above and it will appear here with a traceable ID.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table data-testid="reports-table" className="w-full text-[13px]">
                <thead className="text-left text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-3 pr-4">Report ID</th>
                    <th className="py-3 pr-4">Region</th>
                    <th className="py-3 pr-4">Issue</th>
                    <th className="py-3 pr-4">Urgency</th>
                    <th className="py-3 pr-4">Workflow</th>
                    <th className="py-3 pr-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr data-testid={`report-${r.report_id}-row`} key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td data-testid={`report-${r.report_id}-id`} className="py-3 pr-4 font-mono text-cyan-300">{r.report_id}</td>
                      <td className="py-3 pr-4 text-slate-200">{r.region_name}</td>
                      <td className="py-3 pr-4 text-slate-300">{r.issue_type}</td>
                      <td className="py-3 pr-4">
                        <span data-testid={`report-${r.report_id}-urgency`} className={`text-[11px] px-2 py-0.5 rounded-full ${urgencyBadge(r.urgency)}`}>{r.urgency}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <WorkflowBar step={r.step} />
                        <div data-testid={`report-${r.report_id}-status`} className="mt-1 text-[11px] text-slate-400 font-mono">{r.status}</div>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        {r.step < 5 ? (
                          <button data-testid={`report-${r.report_id}-advance-button`} onClick={() => onAdvance(r.report_id)} className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 text-[12px]">
                            Advance <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span data-testid={`report-${r.report_id}-resolved-indicator`} className="inline-flex items-center gap-1.5 text-emerald-300 text-[12px]"><Check className="h-3.5 w-3.5" /> Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function WorkflowBar({ step }) {
  return (
    <div className="flex items-center gap-1">
      {WORKFLOW.map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-8 rounded-full"
          style={{ background: i < step ? "linear-gradient(90deg,#22d3ee,#34d399)" : "rgba(120,156,200,0.15)" }}
        />
      ))}
    </div>
  );
}
