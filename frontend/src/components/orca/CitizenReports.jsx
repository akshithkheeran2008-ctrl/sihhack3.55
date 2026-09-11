import React, { useState } from "react";
import { Camera, Upload, MapPin, AlertTriangle, Check } from "lucide-react";
import { regions, issueTypes } from "../../mock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../../hooks/use-toast";

export default function CitizenReports() {
  const [location, setLocation] = useState("gulf-of-mannar");
  const [issue, setIssue] = useState("Plastic Waste");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const submit = (e) => {
    e.preventDefault();
    const id = "ORC-" + Math.floor(1000 + Math.random() * 9000);
    setSubmitted(id);
    toast({ title: "Report submitted (demo)", description: `Traceable ID ${id} routed to response team.` });
  };

  return (
    <section id="citizen-reports" className="section-bg py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="section-num">05 · CITIZEN REPORTS</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">Your observation is a coastal sensor</h2>
          <p className="mt-4 text-slate-300/80">
            Upload a local photo, describe what you see, and let the demo workflow route it to the right response team.
          </p>

          <ol className="mt-8 space-y-4">
            {["Share the location and signal type.", "ORCA AI classifies urgency using simulated reasoning.", "Response teams receive a traceable report ID."].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="h-8 w-8 flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 font-mono text-[12px]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[14px] text-slate-200 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-7 panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Create a field report</h3>
              <p className="text-[12px] text-slate-400 mt-1">Demo submission · local image preview only</p>
            </div>
            <div className="h-10 w-10 rounded-xl border border-cyan-400/25 bg-cyan-400/10 flex items-center justify-center">
              <Camera className="h-4 w-4 text-cyan-300" />
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] text-slate-400">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="orca-select-trigger h-11 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {regions.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[12px] text-slate-400">Issue type</label>
              <Select value={issue} onValueChange={setIssue}>
                <SelectTrigger className="orca-select-trigger h-11 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {issueTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[12px] text-slate-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full h-11 rounded-md bg-[#0a1626] border border-cyan-400/15 px-3 text-[14px] text-slate-100 focus:outline-none focus:border-cyan-400/60"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[12px] text-slate-400">Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="Describe what you observed, when, and any nearby landmarks."
                className="mt-1 w-full rounded-md bg-[#0a1626] border border-cyan-400/15 px-3 py-2 text-[14px] text-slate-100 focus:outline-none focus:border-cyan-400/60"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[12px] text-slate-400">Upload image (optional, local preview)</label>
              <div className="mt-1 flex items-center gap-3">
                <label className="btn-ghost inline-flex items-center gap-2 py-2 px-4 text-[13px] cursor-pointer">
                  <Upload className="h-4 w-4" /> Choose a shoreline image
                  <input type="file" accept="image/*" onChange={onImage} className="hidden" />
                </label>
                {image && <img src={image} alt="preview" className="h-16 w-24 object-cover rounded-md border border-white/10" />}
              </div>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary inline-flex items-center gap-2">
                {submitted ? <><Check className="h-4 w-4" /> Submitted · {submitted}</> : <><AlertTriangle className="h-4 w-4" /> Submit citizen report</>}
              </button>
              {submitted && <span className="ml-3 text-[12px] text-emerald-300">Traceable ID assigned. Routed to demo response team.</span>}
            </div>
          </form>

          <div className="mt-6 flex items-center gap-2 text-[12px] text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-cyan-300" /> Reports route by lat/long geo-tag when available.
          </div>
        </div>
      </div>
    </section>
  );
}
