import enum
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.models.base import BaseEntity

# Enums
class FacilityType(str, enum.Enum):
    MANUFACTURING = "Manufacturing"
    WAREHOUSE = "Warehouse"
    DISTRIBUTION_CENTER = "Distribution Center"
    CUSTOMER_DESTINATION = "Customer Destination"

class TransportMode(str, enum.Enum):
    AIR = "Air"
    OCEAN = "Ocean"
    RAIL = "Rail"
    ROAD = "Road"

class OrderPriority(str, enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class OrderStatus(str, enum.Enum):
    PENDING = "Pending"
    PROCESSING = "Processing"
    IN_TRANSIT = "In Transit"
    PARTIALLY_FULFILLED = "Partially Fulfilled"
    FULFILLED = "Fulfilled"
    DELAYED = "Delayed"
    DISRUPTED = "Disrupted"
    CANCELLED = "Cancelled"

class ShipmentStatus(str, enum.Enum):
    PLANNED = "Planned"
    BOOKED = "Booked"
    IN_TRANSIT = "In Transit"
    DELAYED = "Delayed"
    REROUTED = "Rerouted"
    DELIVERED = "Delivered"
    CANCELLED = "Cancelled"

# Models
class Product(BaseEntity):
    __tablename__ = "products"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    sku = Column(String(60), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), default="Components", nullable=False)
    description = Column(Text, nullable=True)
    unit_cost = Column(Float, default=0.0, nullable=False)
    weight_kg = Column(Float, default=0.1, nullable=False)
    volume_m3 = Column(Float, default=0.001, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    supplier_offerings = relationship("SupplierProduct", back_populates="product", cascade="all, delete-orphan")
    inventory_items = relationship("Inventory", back_populates="product", cascade="all, delete-orphan")

class Supplier(BaseEntity):
    __tablename__ = "suppliers"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(30), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    reliability_score = Column(Float, default=95.0, nullable=False)
    lead_time_days = Column(Integer, default=5, nullable=False)
    moq = Column(Integer, default=500, nullable=False)
    production_capacity = Column(Integer, default=50000, nullable=False)
    available_stock = Column(Integer, default=10000, nullable=False)
    status = Column(String(30), default="Active", nullable=False)  # Active, Disrupted, Suspended
    is_certified = Column(Boolean, default=True, nullable=False)
    contractual_constraints = Column(Text, nullable=True)

    # Relationships
    products = relationship("SupplierProduct", back_populates="supplier", cascade="all, delete-orphan")
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")

class SupplierProduct(BaseEntity):
    __tablename__ = "supplier_products"

    supplier_id = Column(String(36), ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    unit_price = Column(Float, nullable=False)
    lead_time_days = Column(Integer, default=5, nullable=False)
    moq = Column(Integer, default=500, nullable=False)
    production_capacity = Column(Integer, default=10000, nullable=False)
    available_stock = Column(Integer, default=2000, nullable=False)

    # Relationships
    supplier = relationship("Supplier", back_populates="products")
    product = relationship("Product", back_populates="supplier_offerings")

class Facility(BaseEntity):
    __tablename__ = "facilities"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(30), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    facility_type = Column(String(50), default=FacilityType.WAREHOUSE.value, nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    operating_cost_per_day = Column(Float, default=1000.0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    warehouse_details = relationship("Warehouse", back_populates="facility", uselist=False, cascade="all, delete-orphan")

class Warehouse(BaseEntity):
    __tablename__ = "warehouses"

    facility_id = Column(String(36), ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    storage_capacity = Column(Integer, default=50000, nullable=False)
    handling_capacity_per_day = Column(Integer, default=5000, nullable=False)
    operating_cost = Column(Float, default=2500.0, nullable=False)
    status = Column(String(30), default="Normal", nullable=False)

    # Relationships
    facility = relationship("Facility", back_populates="warehouse_details")
    inventory_items = relationship("Inventory", back_populates="warehouse", cascade="all, delete-orphan")

class Inventory(BaseEntity):
    __tablename__ = "inventory"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    warehouse_id = Column(String(36), ForeignKey("warehouses.id", ondelete="CASCADE"), nullable=False, index=True)
    on_hand = Column(Integer, default=0, nullable=False)
    reserved = Column(Integer, default=0, nullable=False)
    safety_stock = Column(Integer, default=500, nullable=False)
    unit_cost = Column(Float, default=0.0, nullable=False)
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    product = relationship("Product", back_populates="inventory_items")
    warehouse = relationship("Warehouse", back_populates="inventory_items")
    reservations = relationship("InventoryReservation", back_populates="inventory", cascade="all, delete-orphan")
    movements = relationship("InventoryMovement", back_populates="inventory", cascade="all, delete-orphan")

    @property
    def available_to_promise(self) -> int:
        return max(0, self.on_hand - self.reserved)

class InventoryReservation(BaseEntity):
    __tablename__ = "inventory_reservations"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    inventory_id = Column(String(36), ForeignKey("inventory.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_order_item_id = Column(String(36), nullable=True, index=True)
    quantity = Column(Integer, nullable=False)
    status = Column(String(30), default="Reserved", nullable=False)  # Reserved, Fulfilled, Released
    notes = Column(String(255), nullable=True)

    # Relationships
    inventory = relationship("Inventory", back_populates="reservations")

class InventoryMovement(BaseEntity):
    __tablename__ = "inventory_movements"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    inventory_id = Column(String(36), ForeignKey("inventory.id", ondelete="CASCADE"), nullable=False, index=True)
    movement_type = Column(String(50), nullable=False)  # Inbound PO, Outbound Order, Transfer Out, Transfer In
    quantity = Column(Integer, nullable=False)
    reference_id = Column(String(100), nullable=True)
    notes = Column(String(255), nullable=True)

    # Relationships
    inventory = relationship("Inventory", back_populates="movements")

class PurchaseOrder(BaseEntity):
    __tablename__ = "purchase_orders"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    po_number = Column(String(60), unique=True, index=True, nullable=False)
    supplier_id = Column(String(36), ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False, index=True)
    destination_facility_id = Column(String(36), ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(30), default=OrderStatus.PENDING.value, nullable=False)
    order_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    expected_arrival_date = Column(DateTime, nullable=False)
    total_cost = Column(Float, default=0.0, nullable=False)

    # Relationships
    supplier = relationship("Supplier", back_populates="purchase_orders")
    items = relationship("PurchaseOrderItem", back_populates="purchase_order", cascade="all, delete-orphan")

class PurchaseOrderItem(BaseEntity):
    __tablename__ = "purchase_order_items"

    purchase_order_id = Column(String(36), ForeignKey("purchase_orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)

    # Relationships
    purchase_order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product")

class CustomerOrder(BaseEntity):
    __tablename__ = "customer_orders"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    order_number = Column(String(60), unique=True, index=True, nullable=False)
    customer_name = Column(String(150), nullable=False)
    destination_facility_id = Column(String(36), ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    priority = Column(String(30), default=OrderPriority.MEDIUM.value, nullable=False)
    order_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    required_delivery_date = Column(DateTime, nullable=False)
    delay_penalty_per_day = Column(Float, default=1000.0, nullable=False)
    status = Column(String(30), default=OrderStatus.PENDING.value, nullable=False)

    # Relationships
    destination_facility = relationship("Facility")
    items = relationship("CustomerOrderItem", back_populates="customer_order", cascade="all, delete-orphan")

class CustomerOrderItem(BaseEntity):
    __tablename__ = "customer_order_items"

    customer_order_id = Column(String(36), ForeignKey("customer_orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    allocated_quantity = Column(Integer, default=0, nullable=False)
    fulfilled_quantity = Column(Integer, default=0, nullable=False)
    unit_price = Column(Float, nullable=False)

    # Relationships
    customer_order = relationship("CustomerOrder", back_populates="items")
    product = relationship("Product")

class TransportRoute(BaseEntity):
    __tablename__ = "transport_routes"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    origin_facility_id = Column(String(36), ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    destination_facility_id = Column(String(36), ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    transport_mode = Column(String(30), default=TransportMode.ROAD.value, nullable=False)
    distance_km = Column(Float, default=500.0, nullable=False)
    base_cost_per_unit = Column(Float, default=2.5, nullable=False)
    transit_time_days = Column(Float, default=3.0, nullable=False)
    reliability_rating = Column(Float, default=95.0, nullable=False)
    max_capacity = Column(Integer, default=10000, nullable=False)

    # Relationships
    origin_facility = relationship("Facility", foreign_keys=[origin_facility_id])
    destination_facility = relationship("Facility", foreign_keys=[destination_facility_id])
    shipments = relationship("Shipment", back_populates="route")

class Shipment(BaseEntity):
    __tablename__ = "shipments"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    shipment_number = Column(String(60), unique=True, index=True, nullable=False)
    route_id = Column(String(36), ForeignKey("transport_routes.id", ondelete="SET NULL"), nullable=True, index=True)
    origin_facility_id = Column(String(36), ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    destination_facility_id = Column(String(36), ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    carrier = Column(String(100), nullable=False)
    transport_mode = Column(String(30), default=TransportMode.ROAD.value, nullable=False)
    planned_departure = Column(DateTime, nullable=False)
    planned_arrival = Column(DateTime, nullable=False)
    estimated_arrival = Column(DateTime, nullable=False)
    actual_arrival = Column(DateTime, nullable=True)
    shipment_cost = Column(Float, default=0.0, nullable=False)
    status = Column(String(30), default=ShipmentStatus.PLANNED.value, nullable=False)

    # Relationships
    route = relationship("TransportRoute", back_populates="shipments")
    origin_facility = relationship("Facility", foreign_keys=[origin_facility_id])
    destination_facility = relationship("Facility", foreign_keys=[destination_facility_id])
    items = relationship("ShipmentItem", back_populates="shipment", cascade="all, delete-orphan")

class ShipmentItem(BaseEntity):
    __tablename__ = "shipment_items"

    shipment_id = Column(String(36), ForeignKey("shipments.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)

    # Relationships
    shipment = relationship("Shipment", back_populates="items")
    product = relationship("Product")
