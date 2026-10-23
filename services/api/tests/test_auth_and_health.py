def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "ok"
    assert "timestamp" in data

def test_user_registration_and_login(client):
    # 1. Register a new user
    reg_payload = {
        "email": "ops.director@flowchain.ai",
        "full_name": "Dr. Sarah Chen",
        "password": "SecurePassword123!",
        "organization_name": "Apex Microelectronics Inc."
    }
    response = client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 201
    reg_data = response.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == "ops.director@flowchain.ai"
    assert len(reg_data["user"]["memberships"]) == 1
    assert reg_data["user"]["memberships"][0]["role"] == "Organization Owner"
    assert reg_data["user"]["memberships"][0]["organization_name"] == "Apex Microelectronics Inc."

    token = reg_data["access_token"]
    org_id = reg_data["user"]["memberships"][0]["organization_id"]

    # 2. Duplicate registration should fail
    dup_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert dup_res.status_code == 400

    # 3. Login with credentials
    login_res = client.post("/api/v1/auth/login", json={
        "email": "ops.director@flowchain.ai",
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    assert login_data["user"]["full_name"] == "Dr. Sarah Chen"

    # 4. Access protected profile
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "ops.director@flowchain.ai"

    # 5. List organizations
    orgs_res = client.get("/api/v1/organizations", headers=headers)
    assert orgs_res.status_code == 200
    orgs_data = orgs_res.json()
    assert len(orgs_data) == 1
    assert orgs_data[0]["id"] == org_id
    assert orgs_data[0]["name"] == "Apex Microelectronics Inc."
