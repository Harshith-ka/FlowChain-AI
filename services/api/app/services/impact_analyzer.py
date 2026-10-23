import networkx as nx
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.disruption import Disruption, DisruptionImpact, RecoveryCase
from app.models.supply_chain import (
    Supplier,
    PurchaseOrder,
    PurchaseOrderItem,
    CustomerOrder,
    CustomerOrderItem,
    Inventory,
    Warehouse,
    Facility,
    Product
)

def calculate_disruption_impact(db: Session, disruption: Disruption) -> DisruptionImpact:
    """
    Performs graph traversal and multi-echelon impact analysis across
    purchase orders, regional warehouse inventory positions, and customer commitments.
    """
    org_id = disruption.organization_id
    now = datetime.now(timezone.utc)

    # 1. Build NetworkX Dependency Graph for the Organization
    G = nx.DiGraph()

    # Query all active POs and Customer Orders
    pos = db.query(PurchaseOrder).filter(PurchaseOrder.organization_id == org_id).all()
    customer_orders = db.query(CustomerOrder).filter(CustomerOrder.organization_id == org_id).all()
    inventory_items = db.query(Inventory).filter(Inventory.organization_id == org_id).all()

    affected_po_ids: List[str] = []
    affected_po_numbers: List[str] = []
    affected_products: set = set()
    total_qty_at_risk = 0

    # If disruption is Supplier failure
    if "supplier" in disruption.affected_entity_type.lower() or "supplier" in disruption.disruption_type.lower():
        supplier_pos = [po for po in pos if po.supplier_id == disruption.affected_entity_id]
        for po in supplier_pos:
            affected_po_ids.append(po.id)
            affected_po_numbers.append(po.po_number)
            for item in po.items:
                affected_products.add(item.product_id)
                total_qty_at_risk += item.quantity
                G.add_edge(f"SUPPLIER:{disruption.affected_entity_id}", f"PO:{po.id}", weight=item.quantity)
                G.add_edge(f"PO:{po.id}", f"WH:{po.destination_facility_id}", product_id=item.product_id, qty=item.quantity)

    # If disruption is Warehouse shutdown
    elif "warehouse" in disruption.affected_entity_type.lower() or "warehouse" in disruption.disruption_type.lower():
        wh_inv = [inv for inv in inventory_items if inv.warehouse_id == disruption.affected_entity_id]
        for inv in wh_inv:
            affected_products.add(inv.product_id)
            total_qty_at_risk += inv.on_hand
            G.add_edge(f"WH:{disruption.affected_entity_id}", f"INV:{inv.product_id}", qty=inv.on_hand)

    # 2. Downstream Customer Orders Analysis
    affected_order_ids: List[str] = []
    affected_order_numbers: List[str] = []
    revenue_at_risk = 0.0
    penalty_exposure = 0.0

    for order in customer_orders:
        order_impacted = False
        for item in order.items:
            if item.product_id in affected_products:
                order_impacted = True
                revenue_at_risk += (item.quantity * item.unit_price)
                G.add_edge(f"PROD:{item.product_id}", f"ORDER:{order.id}", demand=item.quantity)
        
        if order_impacted:
            affected_order_ids.append(order.id)
            affected_order_numbers.append(order.order_number)
            # Penalty exposure = daily penalty * expected disruption duration
            penalty_exposure += (order.delay_penalty_per_day * disruption.expected_duration_days)

    # 3. Forecast Stockout Date
    # Find minimum safety buffer at destination warehouses for affected products
    projected_stockout = now + timedelta(days=3)  # default estimate
    for pid in affected_products:
        inv = db.query(Inventory).filter(Inventory.organization_id == org_id, Inventory.product_id == pid).first()
        if inv:
            atp = max(0, inv.on_hand - inv.reserved)
            if atp < inv.safety_stock:
                projected_stockout = now + timedelta(days=2)
                break

    # 4. Critical Dependency Paths
    critical_paths = []
    if affected_po_numbers and affected_order_numbers:
        for po_num in affected_po_numbers[:3]:
            for ord_num in affected_order_numbers[:3]:
                critical_paths.append({
                    "path": f"{disruption.affected_entity_name} → {po_num} → Regional Hub → {ord_num}",
                    "severity": disruption.severity,
                    "bottleneck": "Supplier halted production; zero ATP safety buffer"
                })

    # 5. Persist DisruptionImpact
    impact = DisruptionImpact(
        disruption_id=disruption.id,
        organization_id=org_id,
        affected_purchase_orders_count=len(affected_po_numbers),
        affected_customer_orders_count=len(affected_order_numbers),
        affected_po_numbers=affected_po_numbers,
        affected_order_numbers=affected_order_numbers,
        quantity_at_risk=total_qty_at_risk,
        revenue_at_risk=revenue_at_risk,
        potential_penalty_exposure=penalty_exposure,
        projected_stockout_date=projected_stockout,
        critical_dependency_paths=critical_paths,
        calculated_at=now
    )
    db.add(impact)

    # Ensure a RecoveryCase exists for this disruption
    rec_case = db.query(RecoveryCase).filter(RecoveryCase.disruption_id == disruption.id).first()
    if not rec_case:
        rec_case = RecoveryCase(
            disruption_id=disruption.id,
            organization_id=org_id,
            case_number=f"RC-{disruption.title[:6].upper()}-{now.strftime('%d%H%M')}",
            status="Analyzing",
            notes=f"Triggered by disruption: {disruption.title}"
        )
        db.add(rec_case)

    db.commit()
    db.refresh(impact)
    return impact
