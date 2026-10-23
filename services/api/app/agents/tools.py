from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.supply_chain import (
    Supplier,
    SupplierProduct,
    Product,
    Warehouse,
    Facility,
    Inventory,
    TransportRoute,
    CustomerOrder,
    PurchaseOrder
)
from app.models.disruption import Disruption, DisruptionImpact
from app.optimization.models import OptimizationInput
from app.optimization.solver import solve_recovery_optimization

# ----------------- Agent 1: Disruption Intelligence Tools -----------------
def get_disruption(db: Session, disruption_id: str) -> Dict[str, Any]:
    d = db.query(Disruption).filter(Disruption.id == disruption_id).first()
    if not d:
        return {"error": "Disruption not found"}
    return {
        "id": d.id,
        "title": d.title,
        "disruption_type": d.disruption_type,
        "affected_entity_id": d.affected_entity_id,
        "affected_entity_name": d.affected_entity_name,
        "severity": d.severity,
        "duration_days": d.expected_duration_days
    }

def get_affected_orders(db: Session, org_id: str, product_sku: str) -> List[Dict[str, Any]]:
    prod = db.query(Product).filter(Product.organization_id == org_id, Product.sku == product_sku).first()
    if not prod:
        return []
    orders = (
        db.query(CustomerOrder)
        .filter(CustomerOrder.organization_id == org_id)
        .all()
    )
    affected = []
    for o in orders:
        for it in o.items:
            if it.product_id == prod.id:
                affected.append({
                    "order_number": o.order_number,
                    "customer": o.customer_name,
                    "quantity": it.quantity,
                    "deadline": o.required_delivery_date.strftime("%Y-%m-%d"),
                    "penalty_per_day": o.delay_penalty_per_day,
                    "priority": o.priority
                })
    return affected

# ----------------- Agent 2: Supplier Recovery Tools -----------------
def search_suppliers(db: Session, org_id: str, product_sku: str, exclude_supplier_id: str) -> List[Dict[str, Any]]:
    prod = db.query(Product).filter(Product.organization_id == org_id, Product.sku == product_sku).first()
    if not prod:
        return []
    suppliers = (
        db.query(Supplier, SupplierProduct)
        .join(SupplierProduct, Supplier.id == SupplierProduct.supplier_id)
        .filter(
            Supplier.organization_id == org_id,
            Supplier.id != exclude_supplier_id,
            Supplier.status == "Active",
            SupplierProduct.product_id == prod.id
        )
        .all()
    )
    return [
        {
            "supplier_id": s.Supplier.id,
            "code": s.Supplier.code,
            "name": s.Supplier.name,
            "country": s.Supplier.country,
            "available_stock": s.SupplierProduct.available_stock,
            "unit_price": s.SupplierProduct.unit_price,
            "lead_time_days": s.SupplierProduct.lead_time_days,
            "moq": s.SupplierProduct.moq,
            "reliability": s.Supplier.reliability_score
        }
        for s in suppliers
    ]

# ----------------- Agent 3: Inventory Optimization Tools -----------------
def get_inventory_positions(db: Session, org_id: str, product_sku: str) -> List[Dict[str, Any]]:
    prod = db.query(Product).filter(Product.organization_id == org_id, Product.sku == product_sku).first()
    if not prod:
        return []
    invs = (
        db.query(Inventory, Warehouse, Facility)
        .join(Warehouse, Inventory.warehouse_id == Warehouse.id)
        .join(Facility, Warehouse.facility_id == Facility.id)
        .filter(Inventory.organization_id == org_id, Inventory.product_id == prod.id)
        .all()
    )
    return [
        {
            "warehouse_id": i.Warehouse.id,
            "warehouse_name": i.Facility.name,
            "on_hand": i.Inventory.on_hand,
            "reserved": i.Inventory.reserved,
            "atp": max(0, i.Inventory.on_hand - i.Inventory.reserved),
            "safety_stock": i.Inventory.safety_stock
        }
        for i in invs
    ]

# ----------------- Agent 4: Logistics Routing Tools -----------------
def get_transport_network(db: Session, org_id: str) -> List[Dict[str, Any]]:
    routes = db.query(TransportRoute).filter(TransportRoute.organization_id == org_id).all()
    return [
        {
            "route_id": r.id,
            "mode": r.transport_mode,
            "distance_km": r.distance_km,
            "transit_days": r.transit_time_days,
            "cost_per_unit": r.base_cost_per_unit,
            "capacity": r.max_capacity
        }
        for r in routes[:10]
    ]

# ----------------- Agent 5: Cost & Risk Evaluation Tools -----------------
def calculate_procurement_cost(quantity: int, unit_price: float) -> float:
    return float(quantity * unit_price)

def calculate_transport_cost(quantity: int, cost_per_unit: float) -> float:
    return float(quantity * cost_per_unit)

def calculate_penalties(orders_delayed: int, avg_penalty: float, delay_days: float) -> float:
    return float(orders_delayed * avg_penalty * delay_days)

# ----------------- Agent 6: Recovery Orchestrator Tools -----------------
def invoke_mip_solver(db: Session, org_id: str, disruption_id: str, objective_mode: str) -> Dict[str, Any]:
    inp = OptimizationInput(
        disruption_id=disruption_id,
        organization_id=org_id,
        objective_mode=objective_mode,
        max_solver_time_ms=5000
    )
    sol = solve_recovery_optimization(db=db, opt_input=inp)
    return sol.model_dump()
