from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.deps import get_current_org_member, RequireRole
from app.models.organization import OrganizationMember, UserRole
from app.models.supply_chain import Inventory, Product, Warehouse, Facility
from app.schemas.supply_chain import (
    InventoryResponse,
    InventoryCreate,
    InventoryReservationRequest,
    InventoryTransferRequest
)
from app.services.inventory_service import reserve_inventory, release_reservation, transfer_inventory

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get("", response_model=List[InventoryResponse])
def list_inventory(
    warehouse_id: Optional[str] = None,
    product_id: Optional[str] = None,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    query = (
        db.query(Inventory, Product, Warehouse, Facility)
        .join(Product, Inventory.product_id == Product.id)
        .join(Warehouse, Inventory.warehouse_id == Warehouse.id)
        .join(Facility, Warehouse.facility_id == Facility.id)
        .filter(Inventory.organization_id == member.organization_id)
    )
    if warehouse_id:
        query = query.filter(Inventory.warehouse_id == warehouse_id)
    if product_id:
        query = query.filter(Inventory.product_id == product_id)
    
    results = query.all()
    return [
        InventoryResponse(
            id=i.Inventory.id,
            organization_id=i.Inventory.organization_id,
            product_id=i.Inventory.product_id,
            warehouse_id=i.Inventory.warehouse_id,
            on_hand=i.Inventory.on_hand,
            reserved=i.Inventory.reserved,
            safety_stock=i.Inventory.safety_stock,
            unit_cost=i.Inventory.unit_cost,
            available_to_promise=max(0, i.Inventory.on_hand - i.Inventory.reserved),
            last_updated=i.Inventory.last_updated,
            product_sku=i.Product.sku,
            product_name=i.Product.name,
            warehouse_name=i.Facility.name
        )
        for i in results
    ]

@router.post("", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_position(
    inv_in: InventoryCreate,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.SUPPLY_CHAIN_MANAGER
    ]))
):
    existing = db.query(Inventory).filter(
        Inventory.organization_id == member.organization_id,
        Inventory.product_id == inv_in.product_id,
        Inventory.warehouse_id == inv_in.warehouse_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Inventory record already exists for this product and warehouse")

    inv = Inventory(
        organization_id=member.organization_id,
        product_id=inv_in.product_id,
        warehouse_id=inv_in.warehouse_id,
        on_hand=inv_in.on_hand,
        reserved=0,
        safety_stock=inv_in.safety_stock,
        unit_cost=inv_in.unit_cost,
        last_updated=datetime.now(timezone.utc)
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)

    prod = db.query(Product).filter(Product.id == inv.product_id).first()
    wh = db.query(Warehouse, Facility).join(Facility, Warehouse.facility_id == Facility.id).filter(Warehouse.id == inv.warehouse_id).first()

    return InventoryResponse(
        id=inv.id,
        organization_id=inv.organization_id,
        product_id=inv.product_id,
        warehouse_id=inv.warehouse_id,
        on_hand=inv.on_hand,
        reserved=inv.reserved,
        safety_stock=inv.safety_stock,
        unit_cost=inv.unit_cost,
        available_to_promise=inv.on_hand - inv.reserved,
        last_updated=inv.last_updated,
        product_sku=prod.sku if prod else "",
        product_name=prod.name if prod else "",
        warehouse_name=wh.Facility.name if wh else ""
    )

@router.post("/reserve")
def make_reservation(
    req: InventoryReservationRequest,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    res = reserve_inventory(
        db=db,
        organization_id=member.organization_id,
        product_id=req.product_id,
        warehouse_id=req.warehouse_id,
        quantity=req.quantity,
        customer_order_item_id=req.customer_order_item_id,
        notes=req.notes
    )
    return {
        "status": "Success",
        "reservation_id": res.id,
        "quantity_reserved": res.quantity
    }

@router.post("/transfer")
def transfer_stock(
    req: InventoryTransferRequest,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.SUPPLY_CHAIN_MANAGER,
        UserRole.LOGISTICS_MANAGER
    ]))
):
    return transfer_inventory(
        db=db,
        organization_id=member.organization_id,
        product_id=req.product_id,
        source_warehouse_id=req.source_warehouse_id,
        destination_warehouse_id=req.destination_warehouse_id,
        quantity=req.quantity,
        notes=req.notes
    )
