from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_org_member
from app.models.organization import OrganizationMember
from app.models.supply_chain import Supplier, Facility, Warehouse, TransportRoute, Shipment

router = APIRouter(prefix="/network", tags=["Network Digital Twin"])

@router.get("/topology")
def get_network_topology(
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
) -> Dict[str, Any]:
    """
    Returns complete geospatial supply network topology for the Digital Twin GIS.
    Includes nodes (suppliers, facilities, warehouses, customer clusters) and edges (lanes).
    """
    suppliers = db.query(Supplier).filter(Supplier.organization_id == member.organization_id).all()
    facilities = db.query(Facility).filter(Facility.organization_id == member.organization_id).all()
    routes = db.query(TransportRoute).filter(TransportRoute.organization_id == member.organization_id).all()
    shipments = db.query(Shipment).filter(Shipment.organization_id == member.organization_id).all()

    nodes = []
    # Add Supplier nodes
    for s in suppliers:
        nodes.append({
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "type": "Supplier",
            "country": s.country,
            "city": s.city,
            "latitude": s.latitude,
            "longitude": s.longitude,
            "status": s.status,  # Active, Disrupted
            "reliability": s.reliability_score,
            "lead_time_days": s.lead_time_days,
            "capacity": s.production_capacity
        })

    # Add Facility nodes
    for f in facilities:
        nodes.append({
            "id": f.id,
            "code": f.code,
            "name": f.name,
            "type": f.facility_type,
            "country": f.country,
            "city": f.city,
            "latitude": f.latitude,
            "longitude": f.longitude,
            "status": "Active",
            "operating_cost": f.operating_cost_per_day
        })

    edges = []
    for r in routes:
        orig = next((n for n in nodes if n["id"] == r.origin_facility_id), None)
        dest = next((n for n in nodes if n["id"] == r.destination_facility_id), None)
        edges.append({
            "id": r.id,
            "origin_id": r.origin_facility_id,
            "destination_id": r.destination_facility_id,
            "origin_name": orig["name"] if orig else "Origin",
            "destination_name": dest["name"] if dest else "Destination",
            "transport_mode": r.transport_mode,
            "distance_km": r.distance_km,
            "transit_time_days": r.transit_time_days,
            "cost_per_unit": r.base_cost_per_unit,
            "status": "Healthy"
        })

    return {
        "organization_id": member.organization_id,
        "nodes": nodes,
        "edges": edges,
        "active_shipments_count": len(shipments),
        "total_nodes": len(nodes),
        "total_edges": len(edges)
    }
