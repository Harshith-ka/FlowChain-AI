from test_supply_chain_data import get_auth_token

def test_disruption_creation_and_impact_analysis(client):
    token, org_id = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}", "X-Organization-ID": org_id}

    # 1. Seed data
    client.post(f"/api/v1/organizations/{org_id}/seed", headers=headers)

    # 2. Lookup Supplier SP-04 (Pacific Core Tech)
    supp_res = client.get("/api/v1/suppliers", headers=headers)
    sp04 = next(s for s in supp_res.json() if s["code"] == "SP-04")

    # 3. Create Disruption
    payload = {
        "title": "Pacific Core Tech Shenzhen Facility Fire",
        "disruption_type": "Supplier failure",
        "affected_entity_id": sp04["id"],
        "affected_entity_type": "Supplier",
        "affected_entity_name": sp04["name"],
        "severity": "Critical",
        "description": "7-day total facility shutdown due to electrical fire.",
        "expected_duration_days": 7,
        "confidence": 95.0,
        "source": "Supplier Telemetry"
    }

    res = client.post("/api/v1/disruptions", json=payload, headers=headers)
    assert res.status_code == 201
    disruption = res.json()
    assert disruption["title"] == payload["title"]
    assert disruption["latest_impact"] is not None

    impact = disruption["latest_impact"]
    # Verify accurate graph-traversal impact
    assert impact["affected_purchase_orders_count"] >= 1
    assert "PO-8801" in impact["affected_po_numbers"]
    assert impact["affected_customer_orders_count"] >= 12
    assert impact["quantity_at_risk"] >= 10000
    assert impact["potential_penalty_exposure"] > 0
    assert len(impact["critical_dependency_paths"]) > 0

    # 4. Check Recovery Case Created
    cases_res = client.get("/api/v1/disruptions/cases", headers=headers)
    assert cases_res.status_code == 200
    cases = cases_res.json()
    assert len(cases) >= 1
    assert cases[0]["disruption_id"] == disruption["id"]
    assert cases[0]["status"] == "Analyzing"
