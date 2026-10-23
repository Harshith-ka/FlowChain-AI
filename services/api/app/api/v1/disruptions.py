from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_org_member, RequireRole
from app.models.organization import OrganizationMember, UserRole
from app.models.disruption import Disruption, DisruptionImpact, RecoveryCase
from app.schemas.disruption import (
    DisruptionCreate,
    DisruptionResponse,
    DisruptionImpactResponse,
    RecoveryCaseResponse
)
from app.services.impact_analyzer import calculate_disruption_impact

router = APIRouter(prefix="/disruptions", tags=["Disruptions"])

@router.get("", response_model=List[DisruptionResponse])
def list_disruptions(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    query = db.query(Disruption).filter(Disruption.organization_id == member.organization_id)
    if status and status != "all":
        query = query.filter(Disruption.status.ilike(status))
    if severity and severity != "all":
        query = query.filter(Disruption.severity.ilike(severity))

    disruptions = query.order_by(Disruption.start_time.desc()).all()
    output = []
    for d in disruptions:
        impact = (
            db.query(DisruptionImpact)
            .filter(DisruptionImpact.disruption_id == d.id)
            .order_by(DisruptionImpact.calculated_at.desc())
            .first()
        )
        d_resp = DisruptionResponse(
            id=d.id,
            organization_id=d.organization_id,
            title=d.title,
            disruption_type=d.disruption_type,
            affected_entity_id=d.affected_entity_id,
            affected_entity_type=d.affected_entity_type,
            affected_entity_name=d.affected_entity_name,
            severity=d.severity,
            description=d.description,
            start_time=d.start_time,
            expected_duration_days=d.expected_duration_days,
            confidence=d.confidence,
            source=d.source,
            status=d.status,
            latest_impact=DisruptionImpactResponse.model_validate(impact) if impact else None
        )
        output.append(d_resp)
    return output

@router.post("", response_model=DisruptionResponse, status_code=status.HTTP_201_CREATED)
def create_disruption(
    d_in: DisruptionCreate,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.SUPPLY_CHAIN_MANAGER
    ]))
):
    disruption = Disruption(
        organization_id=member.organization_id,
        title=d_in.title,
        disruption_type=d_in.disruption_type,
        affected_entity_id=d_in.affected_entity_id,
        affected_entity_type=d_in.affected_entity_type,
        affected_entity_name=d_in.affected_entity_name,
        severity=d_in.severity,
        description=d_in.description,
        expected_duration_days=d_in.expected_duration_days,
        confidence=d_in.confidence,
        source=d_in.source,
        status="Active"
    )
    db.add(disruption)
    db.commit()
    db.refresh(disruption)

    # Immediately compute graph-traversal impact analysis
    impact = calculate_disruption_impact(db=db, disruption=disruption)

    return DisruptionResponse(
        id=disruption.id,
        organization_id=disruption.organization_id,
        title=disruption.title,
        disruption_type=disruption.disruption_type,
        affected_entity_id=disruption.affected_entity_id,
        affected_entity_type=disruption.affected_entity_type,
        affected_entity_name=disruption.affected_entity_name,
        severity=disruption.severity,
        description=disruption.description,
        start_time=disruption.start_time,
        expected_duration_days=disruption.expected_duration_days,
        confidence=disruption.confidence,
        source=disruption.source,
        status=disruption.status,
        latest_impact=DisruptionImpactResponse.model_validate(impact)
    )

@router.get("/{disruption_id}/impact", response_model=DisruptionImpactResponse)
def get_disruption_impact(
    disruption_id: str,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    disruption = db.query(Disruption).filter(
        Disruption.id == disruption_id,
        Disruption.organization_id == member.organization_id
    ).first()
    if not disruption:
        raise HTTPException(status_code=404, detail="Disruption not found")

    impact = (
        db.query(DisruptionImpact)
        .filter(DisruptionImpact.disruption_id == disruption.id)
        .order_by(DisruptionImpact.calculated_at.desc())
        .first()
    )
    if not impact:
        impact = calculate_disruption_impact(db=db, disruption=disruption)

    return DisruptionImpactResponse.model_validate(impact)

@router.get("/cases", response_model=List[RecoveryCaseResponse])
def list_recovery_cases(
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
):
    cases = db.query(RecoveryCase).filter(RecoveryCase.organization_id == member.organization_id).all()
    return cases
