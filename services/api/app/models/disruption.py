import enum
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from app.models.base import BaseEntity

class DisruptionType(str, enum.Enum):
    SUPPLIER_FAILURE = "Supplier failure"
    SHIPMENT_DELAY = "Shipment delay"
    WAREHOUSE_SHUTDOWN = "Warehouse shutdown"
    INVENTORY_SHORTAGE = "Inventory shortage"
    CAPACITY_REDUCTION = "Transportation capacity reduction"
    DEMAND_SURGE = "Demand surge"
    ROUTE_DISRUPTION = "Route disruption"

class DisruptionSeverity(str, enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class DisruptionStatus(str, enum.Enum):
    ACTIVE = "Active"
    INVESTIGATING = "Investigating"
    RECOVERING = "Recovering"
    RESOLVED = "Resolved"

class RecoveryCaseStatus(str, enum.Enum):
    DRAFT = "Draft"
    ANALYZING = "Analyzing"
    SCENARIOS_READY = "Scenarios Ready"
    PENDING_APPROVAL = "Pending Approval"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    EXECUTION_PLANNED = "Execution Planned"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class Disruption(BaseEntity):
    __tablename__ = "disruptions"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    disruption_type = Column(String(60), nullable=False)
    affected_entity_id = Column(String(36), nullable=False, index=True)
    affected_entity_type = Column(String(50), nullable=False)  # Supplier, Warehouse, Route, Facility
    affected_entity_name = Column(String(150), nullable=False)
    severity = Column(String(30), default=DisruptionSeverity.CRITICAL.value, nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    expected_duration_days = Column(Integer, default=7, nullable=False)
    confidence = Column(Float, default=90.0, nullable=False)
    source = Column(String(100), default="Manual", nullable=False)
    status = Column(String(30), default=DisruptionStatus.ACTIVE.value, nullable=False)

    # Relationships
    impacts = relationship("DisruptionImpact", back_populates="disruption", cascade="all, delete-orphan")
    recovery_cases = relationship("RecoveryCase", back_populates="disruption", cascade="all, delete-orphan")

class DisruptionImpact(BaseEntity):
    __tablename__ = "disruption_impacts"

    disruption_id = Column(String(36), ForeignKey("disruptions.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    affected_purchase_orders_count = Column(Integer, default=0, nullable=False)
    affected_customer_orders_count = Column(Integer, default=0, nullable=False)
    affected_po_numbers = Column(JSON, default=list, nullable=False)
    affected_order_numbers = Column(JSON, default=list, nullable=False)
    quantity_at_risk = Column(Integer, default=0, nullable=False)
    revenue_at_risk = Column(Float, default=0.0, nullable=False)
    potential_penalty_exposure = Column(Float, default=0.0, nullable=False)
    projected_stockout_date = Column(DateTime, nullable=True)
    critical_dependency_paths = Column(JSON, default=list, nullable=False)
    calculated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    disruption = relationship("Disruption", back_populates="impacts")

class RecoveryCase(BaseEntity):
    __tablename__ = "recovery_cases"

    disruption_id = Column(String(36), ForeignKey("disruptions.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    case_number = Column(String(60), unique=True, index=True, nullable=False)
    status = Column(String(40), default=RecoveryCaseStatus.ANALYZING.value, nullable=False)
    recommended_scenario_id = Column(String(60), nullable=True)
    approved_scenario_id = Column(String(60), nullable=True)
    approved_by_user_id = Column(String(36), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

    # Relationships
    disruption = relationship("Disruption", back_populates="recovery_cases")
