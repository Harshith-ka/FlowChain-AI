from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

# Product Schemas
class ProductBase(BaseModel):
    sku: str = Field(..., max_length=60)
    name: str = Field(..., max_length=150)
    category: str = "Components"
    description: Optional[str] = None
    unit_cost: float = Field(0.0, ge=0.0)
    weight_kg: float = Field(0.1, ge=0.0)
    volume_m3: float = Field(0.001, ge=0.0)

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: str
    organization_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

# Supplier Schemas
class SupplierBase(BaseModel):
    code: str = Field(..., max_length=30)
    name: str = Field(..., max_length=150)
    country: str = Field(..., max_length=100)
    city: str = Field(..., max_length=100)
    latitude: float
    longitude: float
    reliability_score: float = Field(95.0, ge=0.0, le=100.0)
    lead_time_days: int = Field(5, ge=1)
    moq: int = Field(500, ge=1)
    production_capacity: int = Field(50000, ge=0)
    available_stock: int = Field(10000, ge=0)
    status: str = "Active"
    is_certified: bool = True
    contractual_constraints: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

# Warehouse & Facility Schemas
class FacilityBase(BaseModel):
    code: str
    name: str
    facility_type: str = "Warehouse"
    country: str
    city: str
    latitude: float
    longitude: float
    operating_cost_per_day: float = 1000.0

class WarehouseCreate(BaseModel):
    facility: FacilityBase
    storage_capacity: int = 50000
    handling_capacity_per_day: int = 5000
    operating_cost: float = 2500.0
    status: str = "Normal"

class WarehouseResponse(BaseModel):
    id: str
    facility_id: str
    organization_id: str
    storage_capacity: int
    handling_capacity_per_day: int
    operating_cost: float
    status: str
    facility_name: str
    facility_city: str
    facility_country: str
    latitude: float
    longitude: float
    created_at: datetime

    model_config = {"from_attributes": True}

# Inventory Schemas
class InventoryBase(BaseModel):
    product_id: str
    warehouse_id: str
    on_hand: int = Field(0, ge=0)
    safety_stock: int = Field(500, ge=0)
    unit_cost: float = Field(0.0, ge=0.0)

class InventoryCreate(InventoryBase):
    pass

class InventoryResponse(InventoryBase):
    id: str
    organization_id: str
    reserved: int
    available_to_promise: int
    last_updated: datetime
    product_sku: Optional[str] = None
    product_name: Optional[str] = None
    warehouse_name: Optional[str] = None

    model_config = {"from_attributes": True}

class InventoryReservationRequest(BaseModel):
    product_id: str
    warehouse_id: str
    quantity: int = Field(..., gt=0)
    customer_order_item_id: Optional[str] = None
    notes: Optional[str] = None

class InventoryTransferRequest(BaseModel):
    product_id: str
    source_warehouse_id: str
    destination_warehouse_id: str
    quantity: int = Field(..., gt=0)
    notes: Optional[str] = None

# Orders Schemas
class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., ge=0.0)

class CustomerOrderCreate(BaseModel):
    order_number: str
    customer_name: str
    destination_facility_id: str
    priority: str = "Medium"
    required_delivery_date: datetime
    delay_penalty_per_day: float = 1000.0
    items: List[OrderItemCreate]

class CustomerOrderItemResponse(BaseModel):
    id: str
    product_id: str
    product_sku: str
    product_name: str
    quantity: int
    allocated_quantity: int
    fulfilled_quantity: int
    unit_price: float

    model_config = {"from_attributes": True}

class CustomerOrderResponse(BaseModel):
    id: str
    order_number: str
    customer_name: str
    destination_facility_id: str
    destination_name: Optional[str] = None
    priority: str
    order_date: datetime
    required_delivery_date: datetime
    delay_penalty_per_day: float
    status: str
    items: List[CustomerOrderItemResponse] = []

    model_config = {"from_attributes": True}

# Shipment Schemas
class ShipmentItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)

class ShipmentCreate(BaseModel):
    shipment_number: str
    route_id: Optional[str] = None
    origin_facility_id: str
    destination_facility_id: str
    carrier: str
    transport_mode: str = "Road"
    planned_departure: datetime
    planned_arrival: datetime
    estimated_arrival: datetime
    shipment_cost: float = 0.0
    items: List[ShipmentItemCreate]

class ShipmentResponse(BaseModel):
    id: str
    shipment_number: str
    carrier: str
    transport_mode: str
    origin_name: str
    destination_name: str
    planned_departure: datetime
    planned_arrival: datetime
    estimated_arrival: datetime
    actual_arrival: Optional[datetime] = None
    shipment_cost: float
    status: str
    items_count: int

    model_config = {"from_attributes": True}

# Transport Route Schemas
class TransportRouteResponse(BaseModel):
    id: str
    origin_facility_id: str
    destination_facility_id: str
    origin_name: str
    destination_name: str
    transport_mode: str
    distance_km: float
    base_cost_per_unit: float
    transit_time_days: float
    reliability_rating: float
    max_capacity: int

    model_config = {"from_attributes": True}
