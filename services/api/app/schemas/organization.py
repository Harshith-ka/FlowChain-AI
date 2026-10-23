from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    industry: Optional[str] = "Electronics & High-Tech"

class OrganizationCreate(OrganizationBase):
    slug: Optional[str] = None

class OrganizationResponse(OrganizationBase):
    id: str
    slug: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class MemberAddRequest(BaseModel):
    user_email: str
    role: str = "Viewer"

class OrganizationMemberResponse(BaseModel):
    id: str
    organization_id: str
    user_id: str
    user_email: str
    user_name: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
