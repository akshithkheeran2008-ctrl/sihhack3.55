# ORCA Backend Integration Contracts

## Scope
Turn the mocked **alerts** and **citizen reports** into a real MongoDB-backed workflow with traceable IDs (e.g. `ORC-2401`) and a 5-step response lifecycle.

## Data models

### CitizenReport
```
id: string (UUID, primary key)
report_id: string   // human traceable ID, e.g. ORC-2401
region_id: string   // region slug from mock (gulf-of-mannar etc.)
region_name: string
issue_type: string  // Plastic Waste, Oil Spill, Coral Bleaching, ...
description: string
date: string (YYYY-MM-DD)
status: enum        // Reported | AI Analyzed | Verified | Action Started | Resolved
step: int (1..5)
urgency: enum       // Low | Medium | High | Critical  (simulated AI classification)
created_at: datetime
```

### Alert
```
id: string (UUID)
alert_id: string    // e.g. ALERT-A1
level: enum         // Critical | High | Moderate | Safe
status: enum        // Active | Monitoring | Resolved
title: string
location: string
cause: string
response: string
time: string        // HH:MM IST
```

## API (all under /api)

- `GET  /api/alerts`                 → list all alerts
- `POST /api/alerts/seed`            → idempotent seed of the 6 starter alerts
- `GET  /api/reports`                → list all citizen reports (desc by created_at)
- `POST /api/reports`                → create citizen report; server assigns `report_id`, simulates urgency, starts at step 1
- `GET  /api/reports/{report_id}`    → fetch a single report
- `PATCH /api/reports/{report_id}/advance` → move workflow forward (step+1, updates status)
- `GET  /api/stats`                  → aggregate counters used in hero stats row

## Frontend integration

- `CitizenReports.jsx` posts to `POST /api/reports`; shows the returned `report_id` and urgency; after submit the user sees a "My submissions" list fetched from `GET /api/reports` with a `Advance workflow` button that calls the PATCH.
- `AlertCentre.jsx` fetches `GET /api/alerts` (falls back to mock on error) and calls `/api/alerts/seed` on first mount.
- `Hero.jsx` fetches `GET /api/stats` for the four stat cards, still falling back to mock constants.
- Backend base URL is `${REACT_APP_BACKEND_URL}/api` – no hardcoding.

## Notes
- Urgency is a simulated classifier (rule-based on issue_type + region risk from mock).
- No auth. Public endpoints for the demo.
