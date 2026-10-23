from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    organization_name: Optional[str] = "Acme Global Electronics"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

class OrgMembershipInfo(BaseModel):
    organization_id: str
    organization_name: str
    organization_slug: str
    role: str

    model_config = {"from_attributes": True}

class UserResponse(UserBase):
    id: str
    is_superuser: bool
    created_at: datetime
    updated_at: datetime
    memberships: List[OrgMembershipInfo] = []

    model_config = {"from_attributes": True}
