import enum
from sqlalchemy import Column, String, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.models.base import BaseEntity

class UserRole(str, enum.Enum):
    ORGANIZATION_OWNER = "Organization Owner"
    OPERATIONS_ADMIN = "Operations Admin"
    SUPPLY_CHAIN_MANAGER = "Supply Chain Manager"
    LOGISTICS_MANAGER = "Logistics Manager"
    PROCUREMENT_MANAGER = "Procurement Manager"
    VIEWER = "Viewer"

class Organization(BaseEntity):
    __tablename__ = "organizations"

    name = Column(String(120), nullable=False)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    industry = Column(String(100), default="Electronics & High-Tech", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")

class OrganizationMember(BaseEntity):
    __tablename__ = "organization_members"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(50), default=UserRole.VIEWER.value, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="memberships")
