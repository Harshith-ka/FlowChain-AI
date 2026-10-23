from test_supply_chain_data import get_auth_token

def test_ortools_optimization_solver_and_pareto_comparison(client):
    token, org_id = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}", "X-Organization-ID": org_id}

    # 1. Seed supply chain dataset
    client.post(f"/api/v1/organizations/{org_id}/seed", headers=headers)

    # 2. Get Disrupted Supplier SP-04
    supp_res = client.get("/api/v1/suppliers", headers=headers)
    sp04 = next(s for s in supp_res.json() if s["code"] == "SP-04")

    # 3. Create Disruption
    dis_res = client.post("/api/v1/disruptions", json={
        "title": "Shenzhen Facility Fire",
        "disruption_type": "Supplier failure",
        "affected_entity_id": sp04["id"],
        "affected_entity_type": "Supplier",
        "affected_entity_name": sp04["name"],
        "severity": "Critical",
        "expected_duration_days": 7
    }, headers=headers)
    disruption = dis_res.json()
    disruption_id = disruption["id"]

    # 4. Solve Cost-First Strategy
    cost_res = client.post("/api/v1/optimization/solve", json={
        "disruption_id": disruption_id,
        "organization_id": org_id,
        "target_product_skus": ["MCU-X8"],
        "objective_mode": "Cost-First",
        "max_solver_time_ms": 5000
    }, headers=headers)
    assert cost_res.status_code == 200
    cost_sol = cost_res.json()
    assert cost_sol["is_feasible"] is True
    assert cost_sol["solver_status"] in ["OPTIMAL", "FEASIBLE"]
    assert cost_sol["total_recovery_cost"] > 0
    assert cost_sol["execution_time_ms"] > 0
    assert len(cost_sol["allocations"]) > 0

    # 5. Solve Speed-First Strategy
    speed_res = client.post("/api/v1/optimization/solve", json={
        "disruption_id": disruption_id,
        "organization_id": org_id,
        "target_product_skus": ["MCU-X8"],
        "objective_mode": "Speed-First",
        "max_solver_time_ms": 5000
    }, headers=headers)
    assert speed_res.status_code == 200
    speed_sol = speed_res.json()
    assert speed_sol["is_feasible"] is True
    # Speed first achieves higher or equal fulfillment rate
    assert speed_sol["fulfillment_rate_percent"] >= cost_sol["fulfillment_rate_percent"]

    # 6. Compare All Three Strategies via /compare
    cmp_res = client.post(f"/api/v1/optimization/compare?disruption_id={disruption_id}", headers=headers)
    assert cmp_res.status_code == 200
    cmp_data = cmp_res.json()
    assert cmp_data["strategies_compared"] == 3
    assert len(cmp_data["solutions"]) == 3
    assert cmp_data["recommended_strategy"] == "Balanced Strategy"

    # 7. Test Infeasible Scenario & Honest Diagnostics
    infeasible_res = client.post("/api/v1/optimization/solve", json={
        "disruption_id": disruption_id,
        "organization_id": org_id,
        "target_product_skus": ["MCU-X8"],
        "objective_mode": "Balanced",
        "infeasible_test_scenario": True
    }, headers=headers)
    assert infeasible_res.status_code == 200
    inf_sol = infeasible_res.json()
    assert inf_sol["is_feasible"] is False
    assert inf_sol["solver_status"] == "INFEASIBLE"
    assert inf_sol["infeasibility_diagnostics"] is not None
    assert len(inf_sol["infeasibility_diagnostics"]["violated_constraints"]) > 0
    assert len(inf_sol["infeasibility_diagnostics"]["recommended_relaxations"]) > 0
