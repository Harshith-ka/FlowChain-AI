from test_supply_chain_data import get_auth_token

def test_six_agent_recovery_workflow_and_human_interrupt(client):
    token, org_id = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}", "X-Organization-ID": org_id}

    # 1. Seed
    client.post(f"/api/v1/organizations/{org_id}/seed", headers=headers)

    # 2. Lookup SP-04
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
    disruption_id = dis_res.json()["id"]

    # 4. Trigger 6-Agent Workflow with Human Approval Interrupt
    run_res = client.post(f"/api/v1/agents/run?disruption_id={disruption_id}&auto_approve=false", headers=headers)
    assert run_res.status_code == 200
    state = run_res.json()

    # Verify All 6 Agents Recorded Execution Traces
    agents_recorded = set(step["agent_name"] for step in state["trace_steps"])
    assert "Disruption Intelligence Agent" in agents_recorded
    assert "Supplier Recovery Agent" in agents_recorded
    assert "Inventory Optimization Agent" in agents_recorded
    assert "Logistics Routing Agent" in agents_recorded
    assert "Cost & Risk Agent" in agents_recorded
    assert "Recovery Orchestrator" in agents_recorded

    # Verify Agent Proposals
    assert len(state["supplier_proposals"]) > 0
    assert len(state["inventory_proposals"]) > 0
    assert len(state["logistics_proposals"]) > 0

    # Verify 3 Mathematical Solver Solutions
    assert len(state["solver_solutions"]) == 3
    modes = [s["objective_mode"] for s in state["solver_solutions"]]
    assert "Cost-First" in modes
    assert "Balanced" in modes
    assert "Speed-First" in modes

    # Verify Human Approval Interrupt was Enforced
    assert state["is_interrupted_for_human_approval"] is True
    assert state["is_approved"] is False
    assert state["current_phase"] == "Pending Approval"
    assert state["final_recommendation"]["recommended_strategy"] == "Balanced Strategy"

    # 5. Human Sign-Off / Approval Action
    appr_res = client.post(f"/api/v1/agents/cases/{disruption_id}/approve", headers=headers)
    assert appr_res.status_code == 200
    appr_data = appr_res.json()
    assert appr_data["status"] == "Approved"
