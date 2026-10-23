from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_org_member, RequireRole
from app.models.organization import OrganizationMember, UserRole
from app.models.supply_chain import Warehouse, Facility
from app.schemas.supply_chain import WarehouseCreate, WarehouseResponse

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])

@router.get("", response_model=List[WarehouseResponse])
def list_warehouses(
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    results = (
        db.query(Warehouse, Facility)
        .join(Facility, Warehouse.facility_id == Facility.id)
        .filter(Warehouse.organization_id == member.organization_id)
        .all()
    )
    return [
        WarehouseResponse(
            id=w.Warehouse.id,
            facility_id=w.Facility.id,
            organization_id=w.Warehouse.organization_id,
            storage_capacity=w.Warehouse.storage_capacity,
            handling_capacity_per_day=w.Warehouse.handling_capacity_per_day,
            operating_cost=w.Warehouse.operating_cost,
            status=w.Warehouse.status,
            facility_name=w.Facility.name,
            facility_city=w.Facility.city,
            facility_country=w.Facility.country,
            latitude=w.Facility.latitude,
            longitude=w.Facility.longitude,
            created_at=w.Warehouse.created_at
        )
        for w in results
    ]

@router.post("", response_model=WarehouseResponse, status_code=status.HTTP_201_CREATED)
def create_warehouse(
    wh_in: WarehouseCreate,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.SUPPLY_CHAIN_MANAGER
    ]))
):
    facility = Facility(
        organization_id=member.organization_id,
        code=wh_in.facility.code,
        name=wh_in.facility.name,
        facility_type="Warehouse",
        country=wh_in.facility.country,
        city=wh_in.facility.city,
        latitude=wh_in.facility.latitude,
        longitude=wh_in.facility.longitude,
        operating_cost_per_day=wh_in.facility.operating_cost_per_day
    )
    db.add(facility)
    db.flush()

    warehouse = Warehouse(
        organization_id=member.organization_id,
        facility_id=facility.id,
        storage_capacity=wh_in.storage_capacity,
        handling_capacity_per_day=wh_in.handling_capacity_per_day,
        operating_cost=wh_in.operating_cost,
        status=wh_in.status
    )
    db.add(warehouse)
    db.commit()
    db.refresh(warehouse)

    return WarehouseResponse(
        id=warehouse.id,
        facility_id=facility.id,
        organization_id=warehouse.organization_id,
        storage_capacity=warehouse.storage_capacity,
        handling_capacity_per_day=warehouse.handling_capacity_per_day,
        operating_cost=warehouse.operating_cost,
        status=warehouse.status,
        facility_name=facility.name,
        facility_city=facility.city,
        facility_country=facility.country,
        latitude=facility.latitude,
        longitude=facility.longitude,
        created_at=warehouse.created_at
    )
