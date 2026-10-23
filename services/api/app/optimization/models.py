from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class OptimizationInput(BaseModel):
    disruption_id: str
    organization_id: str
    target_product_skus: List[str] = ["MCU-X8"]
    objective_mode: str = "Balanced"  # Cost-First, Speed-First, Balanced
    budget_limit: Optional[float] = None
    max_solver_time_ms: int = 5000
    allow_express_air: bool = True
    infeasible_test_scenario: bool = False  # To test honest infeasibility diagnostics

class AllocationResult(BaseModel):
    customer_order_number: str
    product_sku: str
    allocated_quantity: int
    source_type: str  # Supplier or Warehouse Transfer
    source_name: str
    transport_mode: str
    transit_time_days: float
    delivery_date: str
    is_on_time: bool
    lateness_days: float

class SupplierActivation(BaseModel):
    supplier_code: str
    supplier_name: str
    product_sku: str
    quantity: int
    unit_cost: float
    total_cost: float
    lead_time_days: int

class WarehouseTransferPlan(BaseModel):
    source_warehouse: str
    dest_warehouse: str
    product_sku: str
    quantity: int
    transport_mode: str
    transfer_cost: float

class OptimizationSolution(BaseModel):
    solution_id: str
    strategy_name: str
    objective_mode: str
    is_feasible: bool
    solver_status: str
    execution_time_ms: float
    optimality_gap: float
    total_recovery_cost: float
    procurement_cost: float
    transportation_cost: float
    transfer_cost: float
    delay_penalty_cost: float
    total_orders_considered: int
    orders_fulfilled_on_time: int
    fulfillment_rate_percent: float
    unfulfilled_quantity: int
    supplier_activations: List[SupplierActivation] = []
    warehouse_transfers: List[WarehouseTransferPlan] = []
    allocations: List[AllocationResult] = []
    infeasibility_diagnostics: Optional[Dict[str, Any]] = None
    orchestrator_explanation: str
