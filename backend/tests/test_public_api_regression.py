"""Public ORCA API regression tests for stats, alerts, reports, and workflow persistence."""

import os
import re
from datetime import date

import pytest
import requests
from dotenv import load_dotenv


load_dotenv("/app/frontend/.env")
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")

if not BASE_URL:
    pytest.skip("REACT_APP_BACKEND_URL not configured", allow_module_level=True)

API_BASE = f"{BASE_URL.rstrip('/')}/api"


@pytest.fixture(scope="session")
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def created_report_ids():
    ids = []
    yield ids


class TestPublicApiRegression:
    """Covers critical public APIs used by UI regression scope."""

    def test_root_api_available(self, api_client):
        response = api_client.get(f"{API_BASE}/")
        assert response.status_code == 200
        data = response.json()
        assert data.get("message") == "ORCA API"

    def test_stats_shape_and_citizen_count_numeric(self, api_client):
        response = api_client.get(f"{API_BASE}/stats")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data.get("citizen_reports"), int)
        assert isinstance(data.get("active_alerts"), int)
        assert "network_readiness" in data

    def test_alerts_seed_and_list(self, api_client):
        seed_response = api_client.post(f"{API_BASE}/alerts/seed")
        assert seed_response.status_code == 200
        seed_data = seed_response.json()
        assert isinstance(seed_data.get("total"), int)
        assert seed_data["total"] >= 1

        list_response = api_client.get(f"{API_BASE}/alerts")
        assert list_response.status_code == 200
        alerts = list_response.json()
        assert isinstance(alerts, list)
        assert len(alerts) >= 1
        first = alerts[0]
        assert all(key in first for key in ["alert_id", "level", "status", "title", "location"])

    def test_create_report_and_verify_get_persistence(self, api_client, created_report_ids):
        payload = {
            "region_id": "gulf-of-mannar",
            "region_name": "Gulf of Mannar",
            "issue_type": "Plastic Waste",
            "description": "TEST_AUTOMATION regression report",
            "date": str(date.today()),
        }
        create_response = api_client.post(f"{API_BASE}/reports", json=payload)
        assert create_response.status_code == 200
        created = create_response.json()

        assert re.fullmatch(r"ORC-[A-Z0-9]{4}", created.get("report_id", ""))
        assert created["region_id"] == payload["region_id"]
        assert created["issue_type"] == payload["issue_type"]
        assert created["status"] == "Reported"
        assert created["step"] == 1
        assert created["urgency"] == "High"

        created_report_ids.append(created["report_id"])

        get_response = api_client.get(f"{API_BASE}/reports/{created['report_id']}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["report_id"] == created["report_id"]
        assert fetched["description"] == payload["description"]

    def test_advance_report_and_verify_persistence(self, api_client, created_report_ids):
        if not created_report_ids:
            pytest.skip("No created report available to advance")

        report_id = created_report_ids[-1]
        patch_response = api_client.patch(f"{API_BASE}/reports/{report_id}/advance")
        assert patch_response.status_code == 200
        advanced = patch_response.json()
        assert advanced["report_id"] == report_id
        assert advanced["step"] == 2
        assert advanced["status"] == "AI Analyzed"

        get_response = api_client.get(f"{API_BASE}/reports/{report_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["step"] == 2
        assert fetched["status"] == "AI Analyzed"

    def test_report_not_found(self, api_client):
        response = api_client.get(f"{API_BASE}/reports/ORC-XXXX")
        assert response.status_code == 404
        data = response.json()
        assert data.get("detail") == "Report not found"
