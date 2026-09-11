# ORCA / aqua-tracker-84

## Original requirements
- Clone the provided marine-sentinel-2 website and customise it with suitable information for coastal regions across India and a professional design.
- Replace mock citizen-report storage with a MongoDB-backed workflow and traceable IDs; serve seeded alerts from MongoDB.
- The earlier GitHub request for aqua-tracker-84 requires the user's Save to GitHub action; no Git write action is authorised here.

## Current request (2026-09-11)
Add a clear project-information section covering content originality, quality of data collection, student implementation skills and impact/usefulness for society, industry and end users. Preserve the design and functionality. Distinguish implemented capabilities from sample data and future ambitions; do not invent student qualifications or verified impact.

## Audience
Citizens, students and project evaluators; potential coastal community, NGO, fisheries, tourism, research and authority stakeholders. This is a demonstration prototype, not an operational safety service.

## Architecture
- React 19 / Tailwind / existing shadcn components in `/app/frontend`.
- FastAPI / Pydantic / Motor / MongoDB in `/app/backend/server.py`.
- API client: `/app/frontend/src/lib/orcaApi.js`, using REACT_APP_BACKEND_URL.
- MongoDB configured through MONGO_URL and DB_NAME. No new dependencies, credentials, auth or external integrations in this change.
- Homepage assembled in App.js. ORCA components in `src/components/orca`.
- New named `ProjectInformation` component plus `projectInformationContent.js`; styling in App.css.
- API: GET alerts, POST alerts/seed, GET/POST reports, GET reports/{report_id}, PATCH reports/{report_id}/advance, GET stats.
- Public reports: UUID, ORC-XXXX report_id, region_id/name, issue_type, optional description/date, urgency, step, status, created_at.

## Actual implementation / provenance
- Reports persist in MongoDB; urgency is a deterministic rule set, not AI. Five stages are manually advanced. Status names do not establish expert verification, AI analysis or actual resolution.
- Coastal alerts are seeded demonstration scenarios in MongoDB, not live official warnings.
- Regional readings, map report snippets, readiness, fishing-zone counts and ecosystem scores are mocked/simulated. Map snippets are not linked to submitted reports.
- Citizen report count comes from all MongoDB records (including tests), not a verified weekly population. Frontend no longer displays a fabricated verified percentage or fallback citizen count.
- Photos are browser-local previews only, not uploaded or persisted.
- No LLM, satellite/sensor ingestion, authority dispatch or field-impact study.
- Public prototype has no identity verification or independent review; do not submit personal/sensitive data.

## Changes: 2026-09-11
- Added #project-information section after Collaboration, with four clearly labelled evaluation areas: originality, data quality, student skills, impact.
- Added data-provenance ledger distinguishing submissions, alerts, coastal conditions, reasoning/workflow and photographs; includes responsible-use notice.
- Content explicitly credits adaptation of marine-sentinel-2, describes implementation evidence rather than personal student grades, and labels potential impact as unmeasured.
- Added persistent Project info navigation, responsive mobile menu, working topic links, reporting/map links and relevant footer links.
- Replaced previous inert sign-in placeholder with working Project info entry; no authentication implemented or changed.
- Corrected misleading nearby claims: hero demo labels, alert source descriptions, fabricated 68% verification claim, photo storage, authority routing toast and workflow verification wording.
- Added data-testid attributes for new content/navigation and reporting controls.
- Added safety notices beside hero, alert and sailing demonstration content.
- Production frontend build passed; external GET /api/stats and /api/alerts returned successfully.
- Browser verification completed: four evaluation areas, five source rows, disclosures, desktop/mobile navigation, topic/footer anchors and sticky-header offsets passed. No document horizontal overflow at 320/768/1024/1440 widths.
- Backend regression passed 6/6. UI submission, traceable-ID persistence after refresh and manual workflow advancement were verified against the API. Blocked stats requests correctly show an unavailable count rather than sample citizen totals.
- `/app/test_reports/iteration_1.json` reports no outstanding in-scope bugs. An initial timing/selector issue in the test was resolved by retesting; no production-code changes by the testing agent.
- Main-agent follow-up GETs confirmed ORC-E153 persisted at step 4 and ORC-9F8E at step 2. Automated test records remain in the public demo database and are included in its total count; they are not field-impact evidence.
- Test artifacts: `/app/backend/tests/test_public_api_regression.py`, `/app/test_reports/pytest/pytest_results.xml`, `/app/test_reports/iteration_1.json`.

## Priorities
### P0: Current scope complete
- Project-information content, truthful adjacent labels, navigation and reporting regression checks are complete. No outstanding bugs in the approved scope.
- Ready for user review via Project info in the navigation.

### P1: Proposed next work (not approved for this change)
- Better collection quality: validation, evidence handling, source/freshness metadata, duplicate-event detection and independent review process.
- Realtime activity feed for new reports/alerts.
- Zoomable district map with real satellite SST/wave sources (requires sources/integration requirements first).

### P2: Future/backlog
- Individual ORC-XXXX pages with timeline, photos and response notes.
- Collect documented student contributions and supervised assessment evidence; measure a real pilot before claiming impact.
- Existing out-of-scope demo controls include prewritten AI console, module/open-console placeholders and nonfunctional PDF export. Fisherman saved list is current-session only, not truly offline persistence.
- Backend public demo workflow is not suitable for independent verification or safety operations; current status names remain for compatibility.

## Suggested enhancement
Add a reviewer-evidence checklist per citizen report so project evaluators and future field teams can distinguish a submitted observation from a confirmed event.

## References
- `/app/contracts.md` (historical integration contract)
- `/app/memory/test_credentials.md`
- Preview URL must be read from frontend/.env; original user website URL is a reference, not the current test target.