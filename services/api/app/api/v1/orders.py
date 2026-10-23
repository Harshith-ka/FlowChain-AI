from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.deps import get_current_org_member, RequireRole
from app.models.organization import OrganizationMember, UserRole
from app.models.supply_chain import CustomerOrder, CustomerOrderItem, PurchaseOrder, PurchaseOrderItem, Product, Facility
from app.schemas.supply_chain import (
    CustomerOrderCreate,
    CustomerOrderResponse,
    CustomerOrderItemResponse
)

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/customer", response_model=List[CustomerOrderResponse])
def list_customer_orders(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    query = (
        db.query(CustomerOrder, Facility)
        .join(Facility, CustomerOrder.destination_facility_id == Facility.id)
        .filter(CustomerOrder.organization_id == member.organization_id)
    )
    if status and status != "all":
        query = query.filter(CustomerOrder.status == status)
    if priority and priority != "all":
        query = query.filter(CustomerOrder.priority == priority)

    orders = query.all()
    output = []
    for order, fac in orders:
        items = (
            db.query(CustomerOrderItem, Product)
            .join(Product, CustomerOrderItem.product_id == Product.id)
            .filter(CustomerOrderItem.customer_order_id == order.id)
            .all()
        )
        item_responses = [
            CustomerOrderItemResponse(
                id=item.CustomerOrderItem.id,
                product_id=item.Product.id,
                product_sku=item.Product.sku,
                product_name=item.Product.name,
                quantity=item.CustomerOrderItem.quantity,
                allocated_quantity=item.CustomerOrderItem.allocated_quantity,
                fulfilled_quantity=item.CustomerOrderItem.fulfilled_quantity,
                unit_price=item.CustomerOrderItem.unit_price
            )
            for item in items
        ]
        output.append(
            CustomerOrderResponse(
                id=order.id,
                order_number=order.order_number,
                customer_name=order.customer_name,
                destination_facility_id=order.destination_facility_id,
                destination_name=fac.name,
                priority=order.priority,
                order_date=order.order_date,
                required_delivery_date=order.required_delivery_date,
                delay_penalty_per_day=order.delay_penalty_per_day,
                status=order.status,
                items=item_responses
            )
        )
    return output

@router.post("/customer", response_model=CustomerOrderResponse, status_code=status.HTTP_201_CREATED)
def create_customer_order(
    order_in: CustomerOrderCreate,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.SUPPLY_CHAIN_MANAGER
    ]))
):
    existing = db.query(CustomerOrder).filter(
        CustomerOrder.organization_id == member.organization_id,
        CustomerOrder.order_number == order_in.order_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Order number '{order_in.order_number}' already exists")

    order = CustomerOrder(
        organization_id=member.organization_id,
        order_number=order_in.order_number,
        customer_name=order_in.customer_name,
        destination_facility_id=order_in.destination_facility_id,
        priority=order_in.priority,
        order_date=datetime.now(timezone.utc),
        required_delivery_date=order_in.required_delivery_date,
        delay_penalty_per_day=order_in.delay_penalty_per_day,
        status="Pending"
    )
    db.add(order)
    db.flush()

    item_responses = []
    for it in order_in.items:
        prod = db.query(Product).filter(Product.id == it.product_id).first()
        if not prod:
            raise HTTPException(status_code=404, detail=f"Product with id '{it.product_id}' not found")
        order_item = CustomerOrderItem(
            customer_order_id=order.id,
            product_id=it.product_id,
            quantity=it.quantity,
            allocated_quantity=0,
            fulfilled_quantity=0,
            unit_price=it.unit_price
        )
        db.add(order_item)
        db.flush()
        item_responses.append(
            CustomerOrderItemResponse(
                id=order_item.id,
                product_id=prod.id,
                product_sku=prod.sku,
                product_name=prod.name,
                quantity=order_item.quantity,
                allocated_quantity=0,
                fulfilled_quantity=0,
                unit_price=order_item.unit_price
            )
        )

    db.commit()
    db.refresh(order)

    fac = db.query(Facility).filter(Facility.id == order.destination_facility_id).first()
    return CustomerOrderResponse(
        id=order.id,
        order_number=order.order_number,
        customer_name=order.customer_name,
        destination_facility_id=order.destination_facility_id,
        destination_name=fac.name if fac else "",
        priority=order.priority,
        order_date=order.order_date,
        required_delivery_date=order.required_delivery_date,
        delay_penalty_per_day=order.delay_penalty_per_day,
        status=order.status,
        items=item_responses
    )
