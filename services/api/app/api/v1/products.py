from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_org_member, RequireRole
from app.models.organization import OrganizationMember, UserRole
from app.models.supply_chain import Product
from app.schemas.supply_chain import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def list_products(
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    query = db.query(Product).filter(Product.organization_id == member.organization_id, Product.is_active == True)
    if search:
        pattern = f"%{search}%"
        query = query.filter((Product.name.ilike(pattern)) | (Product.sku.ilike(pattern)))
    return query.all()

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_in: ProductCreate,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.SUPPLY_CHAIN_MANAGER
    ]))
):
    existing = db.query(Product).filter(
        Product.organization_id == member.organization_id,
        Product.sku == prod_in.sku
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Product SKU '{prod_in.sku}' already exists")

    prod = Product(
        organization_id=member.organization_id,
        **prod_in.model_dump()
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod
