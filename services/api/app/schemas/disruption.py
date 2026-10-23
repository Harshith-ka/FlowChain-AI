from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class DisruptionCreate(BaseModel):
    title: str = Field(..., max_length=200)
    disruption_type: str = "Supplier failure"
    affected_entity_id: str
    affected_entity_type: str = "Supplier"
    affected_entity_name: str
    severity: str = "Critical"
    description: Optional[str] = None
    expected_duration_days: int = Field(7, ge=1)
    confidence: float = Field(90.0, ge=0.0, le=100.0)
    source: str = "Manual"

class DisruptionImpactResponse(BaseModel):
    id: str
    disruption_id: str
    affected_purchase_orders_count: int
    affected_customer_orders_count: int
    affected_po_numbers: List[str]
    affected_order_numbers: List[str]
    quantity_at_risk: int
    revenue_at_risk: float
    potential_penalty_exposure: float
    projected_stockout_date: Optional[datetime] = None
    critical_dependency_paths: List[Dict[str, Any]] = []
    calculated_at: datetime

    model_config = {"from_attributes": True}

class DisruptionResponse(BaseModel):
    id: str
    organization_id: str
    title: str
    disruption_type: str
    affected_entity_id: str
    affected_entity_type: str
    affected_entity_name: str
    severity: str
    description: Optional[str] = None
    start_time: datetime
    expected_duration_days: int
    confidence: float
    source: str
    status: str
    latest_impact: Optional[DisruptionImpactResponse] = None

    model_config = {"from_attributes": True}

class RecoveryCaseResponse(BaseModel):
    id: str
    disruption_id: str
    organization_id: str
    case_number: str
    status: str
    recommended_scenario_id: Optional[str] = None
    approved_scenario_id: Optional[str] = None
    approved_by_user_id: Optional[str] = None
    approved_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
