from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.deps import get_current_org_member, RequireRole
from app.models.organization import OrganizationMember, UserRole
from app.models.supply_chain import Shipment, ShipmentItem, Facility, Product
from app.schemas.supply_chain import ShipmentCreate, ShipmentResponse

router = APIRouter(prefix="/shipments", tags=["Shipments"])

@router.get("", response_model=List[ShipmentResponse])
def list_shipments(
    mode: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    query = (
        db.query(Shipment)
        .filter(Shipment.organization_id == member.organization_id)
    )
    if mode and mode != "all":
        query = query.filter(Shipment.transport_mode.ilike(mode))
    if status and status != "all":
        query = query.filter(Shipment.status.ilike(status))

    shipments = query.all()
    output = []
    for sh in shipments:
        orig = db.query(Facility).filter(Facility.id == sh.origin_facility_id).first()
        dest = db.query(Facility).filter(Facility.id == sh.destination_facility_id).first()
        items_count = db.query(ShipmentItem).filter(ShipmentItem.shipment_id == sh.id).count()
        output.append(
            ShipmentResponse(
                id=sh.id,
                shipment_number=sh.shipment_number,
                carrier=sh.carrier,
                transport_mode=sh.transport_mode,
                origin_name=orig.name if orig else "Origin",
                destination_name=dest.name if dest else "Destination",
                planned_departure=sh.planned_departure,
                planned_arrival=sh.planned_arrival,
                estimated_arrival=sh.estimated_arrival,
                actual_arrival=sh.actual_arrival,
                shipment_cost=sh.shipment_cost,
                status=sh.status,
                items_count=items_count
            )
        )
    return output

@router.post("", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
def create_shipment(
    sh_in: ShipmentCreate,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.LOGISTICS_MANAGER
    ]))
):
    existing = db.query(Shipment).filter(
        Shipment.organization_id == member.organization_id,
        Shipment.shipment_number == sh_in.shipment_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Shipment '{sh_in.shipment_number}' already exists")

    shipment = Shipment(
        organization_id=member.organization_id,
        shipment_number=sh_in.shipment_number,
        route_id=sh_in.route_id,
        origin_facility_id=sh_in.origin_facility_id,
        destination_facility_id=sh_in.destination_facility_id,
        carrier=sh_in.carrier,
        transport_mode=sh_in.transport_mode,
        planned_departure=sh_in.planned_departure,
        planned_arrival=sh_in.planned_arrival,
        estimated_arrival=sh_in.estimated_arrival,
        shipment_cost=sh_in.shipment_cost,
        status="Planned"
    )
    db.add(shipment)
    db.flush()

    for item in sh_in.items:
        sh_item = ShipmentItem(
            shipment_id=shipment.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(sh_item)

    db.commit()
    db.refresh(shipment)

    orig = db.query(Facility).filter(Facility.id == shipment.origin_facility_id).first()
    dest = db.query(Facility).filter(Facility.id == shipment.destination_facility_id).first()

    return ShipmentResponse(
        id=shipment.id,
        shipment_number=shipment.shipment_number,
        carrier=shipment.carrier,
        transport_mode=shipment.transport_mode,
        origin_name=orig.name if orig else "Origin",
        destination_name=dest.name if dest else "Destination",
        planned_departure=shipment.planned_departure,
        planned_arrival=shipment.planned_arrival,
        estimated_arrival=shipment.estimated_arrival,
        actual_arrival=shipment.actual_arrival,
        shipment_cost=shipment.shipment_cost,
        status=shipment.status,
        items_count=len(sh_in.items)
    )
