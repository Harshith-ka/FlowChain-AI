from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_org_member, RequireRole
from app.models.organization import OrganizationMember, UserRole
from app.models.supply_chain import Supplier
from app.schemas.supply_chain import SupplierCreate, SupplierResponse

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.get("", response_model=List[SupplierResponse])
def list_suppliers(
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    query = db.query(Supplier).filter(Supplier.organization_id == member.organization_id)
    if search:
        pattern = f"%{search}%"
        query = query.filter((Supplier.name.ilike(pattern)) | (Supplier.code.ilike(pattern)) | (Supplier.country.ilike(pattern)))
    if status and status != "all":
        query = query.filter(Supplier.status.ilike(status))
    return query.all()

@router.post("", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_supplier(
    supplier_in: SupplierCreate,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.PROCUREMENT_MANAGER,
        UserRole.SUPPLY_CHAIN_MANAGER
    ]))
):
    existing = db.query(Supplier).filter(
        Supplier.organization_id == member.organization_id,
        Supplier.code == supplier_in.code
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Supplier with code '{supplier_in.code}' already exists")

    supplier = Supplier(
        organization_id=member.organization_id,
        **supplier_in.model_dump()
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier(
    supplier_id: str,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    supplier = db.query(Supplier).filter(
        Supplier.id == supplier_id,
        Supplier.organization_id == member.organization_id
    ).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier
