#!/usr/bin/env python3
"""
ORCA Backend API Test Suite
Tests all endpoints as specified in the review request
"""
import requests
import json
from typing import Dict, Any, List

# Base URL from frontend/.env
BASE_URL = "https://aqua-tracker-84.preview.emergentagent.com/api"

class TestResult:
    def __init__(self):
        self.passed = []
        self.failed = []
    
    def add_pass(self, test_name: str, details: str = ""):
        self.passed.append(f"✅ {test_name}: {details}")
    
    def add_fail(self, test_name: str, details: str):
        self.failed.append(f"❌ {test_name}: {details}")
    
    def print_summary(self):
        print("\n" + "="*80)
        print("ORCA BACKEND TEST RESULTS")
        print("="*80)
        
        if self.failed:
            print("\n🔴 FAILED TESTS:")
            for fail in self.failed:
                print(f"  {fail}")
        
        if self.passed:
            print("\n🟢 PASSED TESTS:")
            for pass_test in self.passed:
                print(f"  {pass_test}")
        
        print("\n" + "="*80)
        print(f"Total: {len(self.passed)} passed, {len(self.failed)} failed")
        print("="*80 + "\n")

def test_root_endpoint(result: TestResult):
    """Test 1: GET /api/ → returns {"message":"ORCA API"}"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        if response.status_code != 200:
            result.add_fail("Test 1: GET /api/", f"Status {response.status_code}, expected 200")
            return
        
        data = response.json()
        if data.get("message") == "ORCA API":
            result.add_pass("Test 1: GET /api/", "Returns correct message")
        else:
            result.add_fail("Test 1: GET /api/", f"Got {data}, expected {{'message':'ORCA API'}}")
    except Exception as e:
        result.add_fail("Test 1: GET /api/", f"Exception: {str(e)}")

def test_alerts_list(result: TestResult):
    """Test 2: GET /api/alerts → returns array of at least 6 alerts with correct fields"""
    try:
        response = requests.get(f"{BASE_URL}/alerts", timeout=10)
        if response.status_code != 200:
            result.add_fail("Test 2: GET /api/alerts", f"Status {response.status_code}, expected 200")
            return
        
        alerts = response.json()
        if not isinstance(alerts, list):
            result.add_fail("Test 2: GET /api/alerts", f"Expected array, got {type(alerts)}")
            return
        
        if len(alerts) < 6:
            result.add_fail("Test 2: GET /api/alerts", f"Expected at least 6 alerts, got {len(alerts)}")
            return
        
        # Check first alert has required fields
        required_fields = ["id", "alert_id", "level", "status", "title", "location", "cause", "response", "time"]
        alert = alerts[0]
        missing_fields = [f for f in required_fields if f not in alert]
        
        if missing_fields:
            result.add_fail("Test 2: GET /api/alerts", f"Missing fields: {missing_fields}")
        else:
            # Check alert_id format
            if alert.get("alert_id", "").startswith("ALERT-"):
                result.add_pass("Test 2: GET /api/alerts", f"Returns {len(alerts)} alerts with correct schema")
            else:
                result.add_fail("Test 2: GET /api/alerts", f"alert_id format incorrect: {alert.get('alert_id')}")
    except Exception as e:
        result.add_fail("Test 2: GET /api/alerts", f"Exception: {str(e)}")

def test_alerts_seed(result: TestResult):
    """Test 3: POST /api/alerts/seed → returns {inserted, total} with total >= 6"""
    try:
        # First call
        response1 = requests.post(f"{BASE_URL}/alerts/seed", timeout=10)
        if response1.status_code != 200:
            result.add_fail("Test 3: POST /api/alerts/seed", f"Status {response1.status_code}, expected 200")
            return
        
        data1 = response1.json()
        if "inserted" not in data1 or "total" not in data1:
            result.add_fail("Test 3: POST /api/alerts/seed", f"Missing 'inserted' or 'total' in response: {data1}")
            return
        
        if data1["total"] < 6:
            result.add_fail("Test 3: POST /api/alerts/seed", f"total={data1['total']}, expected >= 6")
            return
        
        # Second call to test idempotency
        response2 = requests.post(f"{BASE_URL}/alerts/seed", timeout=10)
        data2 = response2.json()
        
        if data2["inserted"] == 0 and data2["total"] == data1["total"]:
            result.add_pass("Test 3: POST /api/alerts/seed", f"Idempotent: total={data1['total']}, no duplicates on re-seed")
        else:
            result.add_fail("Test 3: POST /api/alerts/seed", f"Not idempotent: first={data1}, second={data2}")
    except Exception as e:
        result.add_fail("Test 3: POST /api/alerts/seed", f"Exception: {str(e)}")

def test_create_report_oil_spill(result: TestResult) -> str:
    """Test 4: POST /api/reports with Oil Spill → returns Report with correct fields"""
    try:
        payload = {
            "region_id": "gulf-of-mannar",
            "region_name": "Gulf of Mannar",
            "issue_type": "Oil Spill",
            "description": "dark slick near reef",
            "date": "2025-07-10"
        }
        response = requests.post(f"{BASE_URL}/reports", json=payload, timeout=10)
        if response.status_code != 200:
            result.add_fail("Test 4: POST /api/reports (Oil Spill)", f"Status {response.status_code}, expected 200")
            return None
        
        report = response.json()
        
        # Check required fields
        if not report.get("report_id", "").startswith("ORC-"):
            result.add_fail("Test 4: POST /api/reports (Oil Spill)", f"report_id doesn't start with 'ORC-': {report.get('report_id')}")
            return None
        
        if report.get("status") != "Reported":
            result.add_fail("Test 4: POST /api/reports (Oil Spill)", f"status={report.get('status')}, expected 'Reported'")
            return None
        
        if report.get("step") != 1:
            result.add_fail("Test 4: POST /api/reports (Oil Spill)", f"step={report.get('step')}, expected 1")
            return None
        
        if report.get("urgency") != "Critical":
            result.add_fail("Test 4: POST /api/reports (Oil Spill)", f"urgency={report.get('urgency')}, expected 'Critical'")
            return None
        
        result.add_pass("Test 4: POST /api/reports (Oil Spill)", f"Created report {report['report_id']} with urgency=Critical")
        return report["report_id"]
    except Exception as e:
        result.add_fail("Test 4: POST /api/reports (Oil Spill)", f"Exception: {str(e)}")
        return None

def test_list_reports(result: TestResult, expected_report_id: str):
    """Test 5: GET /api/reports → array containing the just-created report"""
    try:
        response = requests.get(f"{BASE_URL}/reports", timeout=10)
        if response.status_code != 200:
            result.add_fail("Test 5: GET /api/reports", f"Status {response.status_code}, expected 200")
            return
        
        reports = response.json()
        if not isinstance(reports, list):
            result.add_fail("Test 5: GET /api/reports", f"Expected array, got {type(reports)}")
            return
        
        # Find the report we just created
        found = any(r.get("report_id") == expected_report_id for r in reports)
        if found:
            result.add_pass("Test 5: GET /api/reports", f"Contains report {expected_report_id}")
        else:
            result.add_fail("Test 5: GET /api/reports", f"Report {expected_report_id} not found in list")
    except Exception as e:
        result.add_fail("Test 5: GET /api/reports", f"Exception: {str(e)}")

def test_get_report_by_id(result: TestResult, report_id: str):
    """Test 6: GET /api/reports/{report_id} → returns the same report"""
    try:
        response = requests.get(f"{BASE_URL}/reports/{report_id}", timeout=10)
        if response.status_code != 200:
            result.add_fail("Test 6: GET /api/reports/{report_id}", f"Status {response.status_code}, expected 200")
            return
        
        report = response.json()
        if report.get("report_id") == report_id:
            result.add_pass("Test 6: GET /api/reports/{report_id}", f"Retrieved report {report_id}")
        else:
            result.add_fail("Test 6: GET /api/reports/{report_id}", f"Got report_id={report.get('report_id')}, expected {report_id}")
    except Exception as e:
        result.add_fail("Test 6: GET /api/reports/{report_id}", f"Exception: {str(e)}")

def test_advance_report_workflow(result: TestResult, report_id: str):
    """Test 7: PATCH /api/reports/{report_id}/advance → advances through workflow"""
    try:
        expected_workflow = [
            (2, "AI Analyzed"),
            (3, "Verified"),
            (4, "Action Started"),
            (5, "Resolved"),
            (5, "Resolved"),  # 6th advance should stay at step 5
        ]
        
        for i, (expected_step, expected_status) in enumerate(expected_workflow, 1):
            response = requests.patch(f"{BASE_URL}/reports/{report_id}/advance", timeout=10)
            if response.status_code != 200:
                result.add_fail(f"Test 7: PATCH advance (call {i})", f"Status {response.status_code}, expected 200")
                return
            
            report = response.json()
            actual_step = report.get("step")
            actual_status = report.get("status")
            
            if actual_step != expected_step or actual_status != expected_status:
                result.add_fail(f"Test 7: PATCH advance (call {i})", 
                              f"Expected step={expected_step}, status='{expected_status}', got step={actual_step}, status='{actual_status}'")
                return
        
        result.add_pass("Test 7: PATCH /api/reports/{report_id}/advance", 
                       "Workflow advances correctly through all 5 steps, caps at step 5")
    except Exception as e:
        result.add_fail("Test 7: PATCH /api/reports/{report_id}/advance", f"Exception: {str(e)}")

def test_create_report_plastic_waste(result: TestResult):
    """Test 8: POST /api/reports with Plastic Waste → urgency=Medium"""
    try:
        payload = {
            "region_id": "goa-coast",
            "region_name": "Goa Coast",
            "issue_type": "Plastic Waste",
            "description": "plastic debris on beach",
            "date": "2025-07-11"
        }
        response = requests.post(f"{BASE_URL}/reports", json=payload, timeout=10)
        if response.status_code != 200:
            result.add_fail("Test 8: POST /api/reports (Plastic Waste)", f"Status {response.status_code}, expected 200")
            return
        
        report = response.json()
        if report.get("urgency") != "Medium":
            result.add_fail("Test 8: POST /api/reports (Plastic Waste)", 
                          f"urgency={report.get('urgency')}, expected 'Medium'")
        else:
            result.add_pass("Test 8: POST /api/reports (Plastic Waste)", 
                          f"Created report {report['report_id']} with urgency=Medium")
    except Exception as e:
        result.add_fail("Test 8: POST /api/reports (Plastic Waste)", f"Exception: {str(e)}")

def test_stats_endpoint(result: TestResult):
    """Test 9: GET /api/stats → returns all required keys with correct values"""
    try:
        response = requests.get(f"{BASE_URL}/stats", timeout=10)
        if response.status_code != 200:
            result.add_fail("Test 9: GET /api/stats", f"Status {response.status_code}, expected 200")
            return
        
        stats = response.json()
        required_keys = [
            "network_readiness", "sst_anomaly", "mean_wind", "last_sync",
            "active_alerts", "safe_fishing_zones", "citizen_reports",
            "verified_reports", "ecosystem_health"
        ]
        
        missing_keys = [k for k in required_keys if k not in stats]
        if missing_keys:
            result.add_fail("Test 9: GET /api/stats", f"Missing keys: {missing_keys}")
            return
        
        # Check citizen_reports >= 2 (we created 2 reports in tests 4 and 8)
        citizen_reports = stats.get("citizen_reports", 0)
        if citizen_reports < 2:
            result.add_fail("Test 9: GET /api/stats", 
                          f"citizen_reports={citizen_reports}, expected >= 2 after creating 2 reports")
        else:
            result.add_pass("Test 9: GET /api/stats", 
                          f"All keys present, citizen_reports={citizen_reports}")
    except Exception as e:
        result.add_fail("Test 9: GET /api/stats", f"Exception: {str(e)}")

def main():
    print("\n🚀 Starting ORCA Backend API Tests...")
    print(f"Base URL: {BASE_URL}\n")
    
    result = TestResult()
    
    # Run all tests in sequence
    test_root_endpoint(result)
    test_alerts_list(result)
    test_alerts_seed(result)
    
    # Create report and get its ID for subsequent tests
    report_id = test_create_report_oil_spill(result)
    
    if report_id:
        test_list_reports(result, report_id)
        test_get_report_by_id(result, report_id)
        test_advance_report_workflow(result, report_id)
    else:
        result.add_fail("Tests 5-7", "Skipped due to report creation failure")
    
    test_create_report_plastic_waste(result)
    test_stats_endpoint(result)
    
    # Print summary
    result.print_summary()
    
    # Return exit code
    return 0 if len(result.failed) == 0 else 1

if __name__ == "__main__":
    exit(main())
