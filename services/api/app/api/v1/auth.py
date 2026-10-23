import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.deps import get_current_user
from app.models.user import User
from app.models.organization import Organization, OrganizationMember, UserRole
from app.schemas.auth import Token, LoginRequest
from app.schemas.user import UserCreate, UserResponse, OrgMembershipInfo

router = APIRouter(prefix="/auth", tags=["Authentication"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

def build_user_response(user: User, db: Session) -> UserResponse:
    memberships = (
        db.query(OrganizationMember, Organization)
        .join(Organization, OrganizationMember.organization_id == Organization.id)
        .filter(OrganizationMember.user_id == user.id, OrganizationMember.is_active == True)
        .all()
    )
    membership_info = [
        OrgMembershipInfo(
            organization_id=m.OrganizationMember.organization_id,
            organization_name=m.Organization.name,
            organization_slug=m.Organization.slug,
            role=m.OrganizationMember.role
        )
        for m in memberships
    ]
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        created_at=user.created_at,
        updated_at=user.updated_at,
        memberships=membership_info
    )

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )
    
    # Create user
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        is_active=True,
        is_superuser=False
    )
    db.add(user)
    db.flush()

    # Create Organization for user
    org_name = user_in.organization_name or "Acme Global Electronics"
    base_slug = slugify(org_name)
    slug = base_slug
    counter = 1
    while db.query(Organization).filter(Organization.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    org = Organization(
        name=org_name,
        slug=slug,
        industry="Electronics & High-Tech"
    )
    db.add(org)
    db.flush()

    # Assign user as Organization Owner
    member = OrganizationMember(
        organization_id=org.id,
        user_id=user.id,
        role=UserRole.ORGANIZATION_OWNER.value,
        is_active=True
    )
    db.add(member)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        user=build_user_response(user, db)
    )

@router.post("/login", response_model=Token)
def login(login_in: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    
    token = create_access_token(subject=user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        user=build_user_response(user, db)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return build_user_response(current_user, db)
