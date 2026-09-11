export const projectAreas = [
  {
    id: "originality", number: "01", icon: "Fingerprint", title: "Content originality",
    label: "Adaptation + implementation", tone: "cyan",
    summary: "An India-focused adaptation, not a claim of a new scientific method.",
    points: [
      "The interface builds on the supplied marine-sentinel-2 reference. Project-specific work brings together Indian coastal locations, local issue categories and a persistent citizen-report workflow.",
      "Regional scenarios connect reefs, mangroves, pollution and fishing safety in one experience. They are illustrative content, not original field measurements or published research."
    ],
    note: "Originality lies in the contextualisation and working integration. Independent authorship, source permissions and scientific novelty have not been verified."
  },
  {
    id: "data-quality", number: "02", icon: "Database", title: "Quality of data collection",
    label: "Traceable, not independently verified", tone: "amber",
    summary: "A stored observation is a starting point—not proof of a coastal event.",
    points: [
      "The form collects a selected region and issue type, with optional observation date and description. The server adds a report ID, creation time, rule-based urgency and workflow status, then stores the record in MongoDB.",
      "Structured fields and traceable IDs support consistent records. However, location is user-selected, date and description may be empty, and reports have no identity checks, duplicate-event detection or independent review."
    ],
    note: "Next quality controls: evidence requirements, location and time validation, duplicate checks, reviewer notes and source/freshness metadata. These are proposed, not implemented."
  },
  {
    id: "implementation", number: "03", icon: "Code2", title: "Student implementation skills",
    label: "Evidence from the current build", tone: "emerald",
    summary: "The project demonstrates an intermediate full-stack prototype scope.",
    points: [
      "Frontend: React components, Tailwind styling, region selection, form state and API-driven report lists. Backend: FastAPI endpoints, Pydantic models and MongoDB persistence.",
      "Applied logic: server-assigned report IDs, deterministic urgency rules and a five-stage workflow that can be advanced manually. These demonstrate application integration, not trained AI or satellite-processing expertise."
    ],
    note: "This describes the implementation, not a grade for individual students. Personal proficiency and authorship need a code walkthrough, contribution history and supervised practical assessment."
  },
  {
    id: "impact", number: "04", icon: "HeartHandshake", title: "Impact & usefulness",
    label: "Potential value · not measured outcomes", tone: "rose",
    summary: "Make local observations easier to record, discuss and follow up.",
    points: [
      "Society: citizens can record shoreline concerns with a reference ID; NGOs and educators could use structured reports to organise discussion and coastal-awareness activities.",
      "Industry: fisheries, tourism and port teams could explore a shared incident-triage format. End users gain one place to submit observations and see their recorded workflow status—not an official response guarantee."
    ],
    note: "No field pilot, adoption study, response-time improvement or environmental benefit has been measured. A pilot should track report completeness, independently confirmed events, acknowledgement time and user feedback."
  }
];

export const dataProvenance = [
  { id: "reports", name: "Citizen submissions", status: "Database-backed", tone: "emerald", detail: "User-entered records persist in MongoDB. Contents are unverified; the report counter includes test submissions and all stored records, not a verified weekly total." },
  { id: "alerts", name: "Coastal alerts", status: "Seeded examples", tone: "amber", detail: "Starter alert scenarios are stored and retrieved from MongoDB. A server response does not make them live warnings; no official alert feed is connected." },
  { id: "conditions", name: "Map, ocean readings & advisories", status: "Simulated", tone: "amber", detail: "Regional readings, readiness, fishing-zone and ecosystem scores are sample values. Map report snippets are examples, not linked to submitted reports. No satellite or sensor collection is running." },
  { id: "reasoning", name: "Reasoning & workflow", status: "Rules + demo stages", tone: "cyan", detail: "Urgency uses fixed rules. The reasoning panel is prewritten; no live LLM is connected. “AI Analyzed”, “Verified” and “Resolved” are manually advanced labels, not evidence of analysis, expert review or real-world resolution." },
  { id: "photos", name: "Report photographs", status: "Local preview only", tone: "cyan", detail: "Selected images are displayed in the current browser session. They are not uploaded, attached to database records or retained as evidence." }
];