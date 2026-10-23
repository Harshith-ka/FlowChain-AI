from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.supply_chain import Inventory, InventoryReservation, InventoryMovement

def reserve_inventory(
    db: Session,
    organization_id: str,
    product_id: str,
    warehouse_id: str,
    quantity: int,
    customer_order_item_id: Optional[str] = None,
    notes: Optional[str] = None
) -> InventoryReservation:
    """
    Transactionally reserve inventory for a customer order or recovery plan action.
    Strictly enforces inventory conservation: cannot allocate more than ATP.
    """
    inventory = (
        db.query(Inventory)
        .filter(
            Inventory.organization_id == organization_id,
            Inventory.product_id == product_id,
            Inventory.warehouse_id == warehouse_id
        )
        .with_for_update()  # Lock row for transaction safety
        .first()
    )
    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory record not found for specified product and warehouse"
        )
    
    atp = inventory.on_hand - inventory.reserved
    if quantity > atp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient available inventory. Requested: {quantity}, Available to promise (ATP): {atp}"
        )
    
    # Increment reservation
    inventory.reserved += quantity
    inventory.last_updated = datetime.now(timezone.utc)

    reservation = InventoryReservation(
        organization_id=organization_id,
        inventory_id=inventory.id,
        customer_order_item_id=customer_order_item_id,
        quantity=quantity,
        status="Reserved",
        notes=notes
    )
    db.add(reservation)

    movement = InventoryMovement(
        organization_id=organization_id,
        inventory_id=inventory.id,
        movement_type="Reservation Locked",
        quantity=quantity,
        reference_id=customer_order_item_id,
        notes=notes
    )
    db.add(movement)
    db.commit()
    db.refresh(reservation)
    return reservation

def release_reservation(
    db: Session,
    organization_id: str,
    reservation_id: str
) -> InventoryReservation:
    reservation = (
        db.query(InventoryReservation)
        .filter(
            InventoryReservation.id == reservation_id,
            InventoryReservation.organization_id == organization_id
        )
        .first()
    )
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if reservation.status != "Reserved":
        raise HTTPException(status_code=400, detail=f"Reservation is already in '{reservation.status}' state")
    
    inventory = db.query(Inventory).filter(Inventory.id == reservation.inventory_id).with_for_update().first()
    if inventory:
        inventory.reserved = max(0, inventory.reserved - reservation.quantity)
        inventory.last_updated = datetime.now(timezone.utc)
    
    reservation.status = "Released"
    db.commit()
    db.refresh(reservation)
    return reservation

def transfer_inventory(
    db: Session,
    organization_id: str,
    product_id: str,
    source_warehouse_id: str,
    destination_warehouse_id: str,
    quantity: int,
    notes: Optional[str] = None
) -> dict:
    """
    Transactionally transfer stock between two warehouses.
    Guarantees flow conservation: quantity deducted from source == quantity credited to destination.
    """
    if source_warehouse_id == destination_warehouse_id:
        raise HTTPException(status_code=400, detail="Source and destination warehouses cannot be identical")

    source_inv = (
        db.query(Inventory)
        .filter(
            Inventory.organization_id == organization_id,
            Inventory.product_id == product_id,
            Inventory.warehouse_id == source_warehouse_id
        )
        .with_for_update()
        .first()
    )
    if not source_inv:
        raise HTTPException(status_code=404, detail="Source warehouse inventory position not found")

    atp = source_inv.on_hand - source_inv.reserved
    if quantity > atp:
        raise HTTPException(
            status_code=400,
            detail=f"Transfer exceeds source available inventory. Requested: {quantity}, Available: {atp}"
        )

    dest_inv = (
        db.query(Inventory)
        .filter(
            Inventory.organization_id == organization_id,
            Inventory.product_id == product_id,
            Inventory.warehouse_id == destination_warehouse_id
        )
        .with_for_update()
        .first()
    )
    if not dest_inv:
        dest_inv = Inventory(
            organization_id=organization_id,
            product_id=product_id,
            warehouse_id=destination_warehouse_id,
            on_hand=0,
            reserved=0,
            safety_stock=source_inv.safety_stock,
            unit_cost=source_inv.unit_cost,
            last_updated=datetime.now(timezone.utc)
        )
        db.add(dest_inv)
        db.flush()

    # Flow conservation update
    source_inv.on_hand -= quantity
    source_inv.last_updated = datetime.now(timezone.utc)

    dest_inv.on_hand += quantity
    dest_inv.last_updated = datetime.now(timezone.utc)

    # Audit movements
    m_out = InventoryMovement(
        organization_id=organization_id,
        inventory_id=source_inv.id,
        movement_type="Transfer Out",
        quantity=-quantity,
        reference_id=destination_warehouse_id,
        notes=notes
    )
    m_in = InventoryMovement(
        organization_id=organization_id,
        inventory_id=dest_inv.id,
        movement_type="Transfer In",
        quantity=quantity,
        reference_id=source_warehouse_id,
        notes=notes
    )
    db.add(m_out)
    db.add(m_in)
    db.commit()

    return {
        "status": "Transferred",
        "product_id": product_id,
        "quantity": quantity,
        "source_on_hand": source_inv.on_hand,
        "dest_on_hand": dest_inv.on_hand
    }
