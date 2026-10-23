import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user, RequireRole
from app.models.user import User
from app.models.organization import Organization, OrganizationMember, UserRole
from app.schemas.organization import (
    OrganizationResponse,
    OrganizationCreate,
    OrganizationMemberResponse,
    MemberAddRequest
)

router = APIRouter(prefix="/organizations", tags=["Organizations"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

@router.get("", response_model=List[OrganizationResponse])
def list_user_organizations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orgs = (
        db.query(Organization)
        .join(OrganizationMember, Organization.id == OrganizationMember.organization_id)
        .filter(OrganizationMember.user_id == current_user.id, OrganizationMember.is_active == True)
        .all()
    )
    return orgs

@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(
    org_in: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    base_slug = org_in.slug or slugify(org_in.name)
    slug = base_slug
    counter = 1
    while db.query(Organization).filter(Organization.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    org = Organization(
        name=org_in.name,
        slug=slug,
        industry=org_in.industry or "Electronics & High-Tech"
    )
    db.add(org)
    db.flush()

    member = OrganizationMember(
        organization_id=org.id,
        user_id=current_user.id,
        role=UserRole.ORGANIZATION_OWNER.value,
        is_active=True
    )
    db.add(member)
    db.commit()
    db.refresh(org)
    return org

@router.get("/{org_id}", response_model=OrganizationResponse)
def get_organization(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = (
        db.query(OrganizationMember)
        .filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.is_active == True
        )
        .first()
    )
    if not member and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found or access denied"
        )
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.get("/{org_id}/members", response_model=List[OrganizationMemberResponse])
def get_organization_members(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = (
        db.query(OrganizationMember)
        .filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.is_active == True
        )
        .first()
    )
    if not membership and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to organization members"
        )
    
    members = (
        db.query(OrganizationMember, User)
        .join(User, OrganizationMember.user_id == User.id)
        .filter(OrganizationMember.organization_id == org_id)
        .all()
    )
    
    return [
        OrganizationMemberResponse(
            id=m.OrganizationMember.id,
            organization_id=m.OrganizationMember.organization_id,
            user_id=m.User.id,
            user_email=m.User.email,
            user_name=m.User.full_name,
            role=m.OrganizationMember.role,
            is_active=m.OrganizationMember.is_active,
            created_at=m.OrganizationMember.created_at
        )
        for m in members
    ]

@router.post("/{org_id}/members", response_model=OrganizationMemberResponse, status_code=status.HTTP_201_CREATED)
def add_organization_member(
    org_id: str,
    req: MemberAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify current user is owner or admin of this org
    admin_member = (
        db.query(OrganizationMember)
        .filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.is_active == True,
            OrganizationMember.role.in_([UserRole.ORGANIZATION_OWNER.value, UserRole.OPERATIONS_ADMIN.value])
        )
        .first()
    )
    if not admin_member and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Organization Owners and Operations Admins can add members"
        )
    
    target_user = db.query(User).filter(User.email == req.user_email).first()
    if not target_user:
        raise HTTPException(status_code=404, detail=f"User with email {req.user_email} not found")
    
    existing = (
        db.query(OrganizationMember)
        .filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == target_user.id
        )
        .first()
    )
    if existing:
        if not existing.is_active:
            existing.is_active = True
            existing.role = req.role
            db.commit()
            db.refresh(existing)
            return OrganizationMemberResponse(
                id=existing.id,
                organization_id=existing.organization_id,
                user_id=target_user.id,
                user_email=target_user.email,
                user_name=target_user.full_name,
                role=existing.role,
                is_active=existing.is_active,
                created_at=existing.created_at
            )
        raise HTTPException(status_code=400, detail="User is already a member of this organization")
    
    new_member = OrganizationMember(
        organization_id=org_id,
        user_id=target_user.id,
        role=req.role,
        is_active=True
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    
    return OrganizationMemberResponse(
        id=new_member.id,
        organization_id=new_member.organization_id,
        user_id=target_user.id,
        user_email=target_user.email,
        user_name=target_user.full_name,
        role=new_member.role,
        is_active=new_member.is_active,
        created_at=new_member.created_at
    )
