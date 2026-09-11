from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- Models ----------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

WORKFLOW = ["Reported", "AI Analyzed", "Verified", "Action Started", "Resolved"]

class ReportCreate(BaseModel):
    region_id: str
    region_name: str
    issue_type: str
    description: str = ""
    date: str = ""

class Report(BaseModel):
    id: str
    report_id: str
    region_id: str
    region_name: str
    issue_type: str
    description: str
    date: str
    status: str
    step: int
    urgency: str
    created_at: datetime

class Alert(BaseModel):
    id: str
    alert_id: str
    level: str
    status: str
    title: str
    location: str
    cause: str
    response: str
    time: str

# ---------- Helpers ----------
HIGH_ISSUES = {"Oil Spill", "Coral Bleaching", "Fish Mortality", "Algal Bloom"}
MED_ISSUES = {"Plastic Waste", "Beach Erosion", "Illegal Fishing", "Injured Marine Animal"}
HIGH_RISK_REGIONS = {"odisha-coast", "paradip-coast", "sundarbans", "gulf-of-mannar", "kutch-coast"}

def classify_urgency(issue_type: str, region_id: str) -> str:
    if issue_type == "Oil Spill" or region_id in {"odisha-coast", "paradip-coast"}:
        return "Critical"
    if issue_type in HIGH_ISSUES or region_id in HIGH_RISK_REGIONS:
        return "High"
    if issue_type in MED_ISSUES:
        return "Medium"
    return "Low"

def next_report_id() -> str:
    # Short human-readable id
    return "ORC-" + uuid.uuid4().hex[:4].upper()

SEED_ALERTS = [
    {"alert_id": "ALERT-A1", "level": "Critical", "status": "Active", "title": "Cyclone & high-wave warning",
     "location": "Odisha Coast \u00b7 Kendrapara", "cause": "Cyclonic depression moving north-west",
     "response": "Do not sail. Follow district disaster authority instructions.", "time": "09:14 IST"},
    {"alert_id": "ALERT-A2", "level": "High", "status": "Monitoring", "title": "Coral bleaching risk",
     "location": "Gulf of Mannar \u00b7 Tuticorin", "cause": "Sea surface temperature +2.1\u00b0C above normal",
     "response": "Inspect local water quality and pause reef-adjacent activity.", "time": "08:58 IST"},
    {"alert_id": "ALERT-A3", "level": "Moderate", "status": "Monitoring", "title": "Possible oil pollution",
     "location": "Mumbai Coast \u00b7 Sewri", "cause": "Citizen report matched to a dark surface slick",
     "response": "Dispatch a verification team and contain shoreline spread.", "time": "07:42 IST"},
    {"alert_id": "ALERT-A4", "level": "High", "status": "Monitoring", "title": "Mangrove stress signal",
     "location": "Sundarbans \u00b7 South 24 Parganas", "cause": "Salinity rising, satellite NDVI drop observed",
     "response": "Alert forest wardens and reinforce protective barriers.", "time": "06:31 IST"},
    {"alert_id": "ALERT-A5", "level": "Moderate", "status": "Monitoring", "title": "Rip current advisory",
     "location": "Chennai Coast \u00b7 Marina", "cause": "Wave interaction with tidal drift",
     "response": "Deploy lifeguards & publish public swim advisory.", "time": "05:22 IST"},
    {"alert_id": "ALERT-A6", "level": "High", "status": "Active", "title": "Storm surge watch",
     "location": "Paradip \u00b7 Jagatsinghpur", "cause": "Deep depression track, surge model at 2.4m",
     "response": "Evacuate low-lying pockets, secure fishing craft.", "time": "04:10 IST"},
]

# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "ORCA API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    obj = StatusCheck(**input.dict())
    await db.status_checks.insert_one(obj.dict())
    return obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**d) for d in docs]

# Alerts
@api_router.post("/alerts/seed")
async def seed_alerts():
    inserted = 0
    for a in SEED_ALERTS:
        existing = await db.alerts.find_one({"alert_id": a["alert_id"]})
        if not existing:
            doc = {"id": str(uuid.uuid4()), **a}
            await db.alerts.insert_one(doc)
            inserted += 1
    total = await db.alerts.count_documents({})
    return {"inserted": inserted, "total": total}

@api_router.get("/alerts", response_model=List[Alert])
async def list_alerts():
    docs = await db.alerts.find().to_list(1000)
    return [Alert(**{k: d.get(k) for k in Alert.model_fields.keys()}) for d in docs]

# Citizen Reports
@api_router.post("/reports", response_model=Report)
async def create_report(payload: ReportCreate):
    report_id = next_report_id()
    # Uniqueness safety
    while await db.reports.find_one({"report_id": report_id}):
        report_id = next_report_id()
    urgency = classify_urgency(payload.issue_type, payload.region_id)
    doc = {
        "id": str(uuid.uuid4()),
        "report_id": report_id,
        "region_id": payload.region_id,
        "region_name": payload.region_name,
        "issue_type": payload.issue_type,
        "description": payload.description or "",
        "date": payload.date or "",
        "status": WORKFLOW[0],
        "step": 1,
        "urgency": urgency,
        "created_at": datetime.utcnow(),
    }
    await db.reports.insert_one(doc)
    return Report(**doc)

@api_router.get("/reports", response_model=List[Report])
async def list_reports():
    docs = await db.reports.find().sort("created_at", -1).to_list(500)
    return [Report(**{k: d.get(k) for k in Report.model_fields.keys()}) for d in docs]

@api_router.get("/reports/{report_id}", response_model=Report)
async def get_report(report_id: str):
    d = await db.reports.find_one({"report_id": report_id})
    if not d:
        raise HTTPException(status_code=404, detail="Report not found")
    return Report(**{k: d.get(k) for k in Report.model_fields.keys()})

@api_router.patch("/reports/{report_id}/advance", response_model=Report)
async def advance_report(report_id: str):
    d = await db.reports.find_one({"report_id": report_id})
    if not d:
        raise HTTPException(status_code=404, detail="Report not found")
    step = min(int(d.get("step", 1)) + 1, len(WORKFLOW))
    status = WORKFLOW[step - 1]
    await db.reports.update_one({"report_id": report_id}, {"$set": {"step": step, "status": status}})
    d["step"] = step
    d["status"] = status
    return Report(**{k: d.get(k) for k in Report.model_fields.keys()})

# Stats
@api_router.get("/stats")
async def get_stats():
    active_alerts = await db.alerts.count_documents({"status": {"$in": ["Active", "Monitoring"]}})
    reports_count = await db.reports.count_documents({})
    verified = await db.reports.count_documents({"step": {"$gte": 3}})
    return {
        "network_readiness": 92,
        "sst_anomaly": "+2.1\u00b0C",
        "mean_wind": "18 km/h",
        "last_sync": "08 MAR \u00b7 09:42 IST",
        "active_alerts": active_alerts if active_alerts > 0 else 6,
        "safe_fishing_zones": 84,
        "citizen_reports": reports_count,
        "verified_reports": verified,
        "ecosystem_health": 72,
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def _seed_on_start():
    try:
        for a in SEED_ALERTS:
            existing = await db.alerts.find_one({"alert_id": a["alert_id"]})
            if not existing:
                await db.alerts.insert_one({"id": str(uuid.uuid4()), **a})
        logger.info("ORCA alerts seeded")
    except Exception as e:
        logger.warning(f"Seed error: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
