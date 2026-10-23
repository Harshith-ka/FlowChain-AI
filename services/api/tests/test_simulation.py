from test_supply_chain_data import get_auth_token

def test_simpy_discrete_event_simulation_engine(client):
    token, org_id = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}", "X-Organization-ID": org_id}

    sim_payload = {
        "disruption_duration_days": 7,
        "demand_surge_multiplier": 1.2,
        "transit_delay_variance_days": 3.0,
        "recovery_budget": 30000.0,
        "simulation_runs": 25,
        "random_seed": 42
    }

    res = client.post("/api/v1/simulations/run", json=sim_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()

    assert data["runs_completed"] == 25
    assert data["mean_cost"] > 0
    assert data["p95_worst_case_cost"] >= data["mean_cost"]
    assert 0.0 <= data["mean_fulfillment_rate"] <= 100.0
    assert len(data["run_samples"]) == 10
    assert data["simulation_time_ms"] > 0
    assert data["risk_level"] in ["Low Risk", "Moderate Risk", "High Risk", "Severe Risk"]
