import pytest

def get_auth_token(client):
    reg_payload = {
        "email": "lead.planner@apex.com",
        "full_name": "Elena Rostova",
        "password": "SecurePassword123!",
        "organization_name": "Apex Microelectronics Inc."
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    data = res.json()
    token = data["access_token"]
    org_id = data["user"]["memberships"][0]["organization_id"]
    return token, org_id

def test_seed_synthetic_supply_chain(client):
    token, org_id = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}", "X-Organization-ID": org_id}

    # 1. Trigger Seed
    seed_res = client.post(f"/api/v1/organizations/{org_id}/seed", headers=headers)
    assert seed_res.status_code == 200
    data = seed_res.json()
    assert data["suppliers"] == 8
    assert data["warehouses"] == 5
    assert data["products"] == 20
    assert data["routes"] == 50
    assert data["customer_orders"] == 100
    assert data["purchase_orders"] == 30
    assert data["shipments"] == 40

    # 2. Verify Suppliers
    supp_res = client.get("/api/v1/suppliers", headers=headers)
    assert supp_res.status_code == 200
    suppliers = supp_res.json()
    assert len(suppliers) == 8
    disrupted = [s for s in suppliers if s["code"] == "SP-04"]
    assert len(disrupted) == 1
    assert disrupted[0]["status"] == "Disrupted"

    # 3. Verify Products
    prod_res = client.get("/api/v1/products", headers=headers)
    assert prod_res.status_code == 200
    products = prod_res.json()
    assert len(products) == 20

    # 4. Verify Digital Twin Topology
    topo_res = client.get("/api/v1/network/topology", headers=headers)
    assert topo_res.status_code == 200
    topo = topo_res.json()
    assert topo["total_nodes"] >= 13  # 8 suppliers + 5 warehouses + customer destinations
    assert topo["total_edges"] >= 50

def test_inventory_conservation_and_reservations(client):
    token, org_id = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}", "X-Organization-ID": org_id}

    # Seed data
    client.post(f"/api/v1/organizations/{org_id}/seed", headers=headers)

    # Fetch inventory for Central Hub Alpha (WH-01) MCU-X8
    inv_res = client.get("/api/v1/inventory", headers=headers)
    assert inv_res.status_code == 200
    inventory = inv_res.json()
    mcu_inv = next(i for i in inventory if i["product_sku"] == "MCU-X8" and "Central Hub Alpha" in i["warehouse_name"])
    
    initial_atp = mcu_inv["available_to_promise"]
    initial_on_hand = mcu_inv["on_hand"]
    initial_reserved = mcu_inv["reserved"]
    assert initial_atp == initial_on_hand - initial_reserved
    assert initial_atp == 400

    # 1. Successful reservation within ATP
    reserve_payload = {
        "product_id": mcu_inv["product_id"],
        "warehouse_id": mcu_inv["warehouse_id"],
        "quantity": 250,
        "notes": "Emergency lock for Tier 1 customer"
    }
    res = client.post("/api/v1/inventory/reserve", json=reserve_payload, headers=headers)
    assert res.status_code == 200
    assert res.json()["quantity_reserved"] == 250

    # Verify updated ATP
    updated_inv = client.get("/api/v1/inventory", headers=headers).json()
    mcu_updated = next(i for i in updated_inv if i["id"] == mcu_inv["id"])
    assert mcu_updated["reserved"] == initial_reserved + 250
    assert mcu_updated["available_to_promise"] == initial_atp - 250
    assert mcu_updated["available_to_promise"] == 150

    # 2. Conservation Violation Attempt: trying to reserve more than ATP
    oversubscribe_payload = {
        "product_id": mcu_inv["product_id"],
        "warehouse_id": mcu_inv["warehouse_id"],
        "quantity": 500  # Only 150 available!
    }
    fail_res = client.post("/api/v1/inventory/reserve", json=oversubscribe_payload, headers=headers)
    assert fail_res.status_code == 400
    assert "Insufficient available inventory" in fail_res.json()["detail"]

def test_warehouse_transfer_flow_conservation(client):
    token, org_id = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}", "X-Organization-ID": org_id}

    client.post(f"/api/v1/organizations/{org_id}/seed", headers=headers)

    inv_list = client.get("/api/v1/inventory", headers=headers).json()
    wh01_mcu = next(i for i in inv_list if i["product_sku"] == "MCU-X8" and "Central Hub Alpha" in i["warehouse_name"])
    wh02_mcu = next(i for i in inv_list if i["product_sku"] == "MCU-X8" and "Distribution Hub Beta" in i["warehouse_name"])

    total_mcu_before = wh01_mcu["on_hand"] + wh02_mcu["on_hand"]
    transfer_qty = 1500

    # Transfer 1500 units from WH-02 to WH-01
    transfer_payload = {
        "product_id": wh01_mcu["product_id"],
        "source_warehouse_id": wh02_mcu["warehouse_id"],
        "destination_warehouse_id": wh01_mcu["warehouse_id"],
        "quantity": transfer_qty,
        "notes": "Lateral stock transfer"
    }
    t_res = client.post("/api/v1/inventory/transfer", json=transfer_payload, headers=headers)
    assert t_res.status_code == 200

    # Verify conservation of stock across both warehouses
    inv_after = client.get("/api/v1/inventory", headers=headers).json()
    wh01_after = next(i for i in inv_after if i["id"] == wh01_mcu["id"])
    wh02_after = next(i for i in inv_after if i["id"] == wh02_mcu["id"])

    assert wh02_after["on_hand"] == wh02_mcu["on_hand"] - transfer_qty
    assert wh01_after["on_hand"] == wh01_mcu["on_hand"] + transfer_qty
    total_mcu_after = wh01_after["on_hand"] + wh02_after["on_hand"]
    assert total_mcu_before == total_mcu_after
