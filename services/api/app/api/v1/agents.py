from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_org_member, RequireRole
from app.models.organization import OrganizationMember, UserRole
from app.models.disruption import Disruption, RecoveryCase
from app.agents.workflow import run_agentic_recovery_workflow

router = APIRouter(prefix="/agents", tags=["AI Agent Center"])

@router.post("/run")
def trigger_agent_workflow(
    disruption_id: str,
    auto_approve: bool = False,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.SUPPLY_CHAIN_MANAGER
    ]))
) -> Dict[str, Any]:
    disruption = db.query(Disruption).filter(
        Disruption.id == disruption_id,
        Disruption.organization_id == member.organization_id
    ).first()
    if not disruption:
        raise HTTPException(status_code=404, detail="Disruption not found")

    workflow_state = run_agentic_recovery_workflow(
        db=db,
        disruption_id=disruption_id,
        organization_id=member.organization_id,
        auto_approve=auto_approve
    )
    return workflow_state

@router.post("/cases/{disruption_id}/approve")
def approve_recovery_plan(
    disruption_id: str,
    scenario_id: Optional[str] = None,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.SUPPLY_CHAIN_MANAGER
    ]))
) -> Dict[str, Any]:
    rec_case = db.query(RecoveryCase).filter(
        RecoveryCase.disruption_id == disruption_id,
        RecoveryCase.organization_id == member.organization_id
    ).first()
    if not rec_case:
        raise HTTPException(status_code=404, detail="Recovery case not found")

    rec_case.status = "Completed"
    rec_case.approved_scenario_id = scenario_id or rec_case.recommended_scenario_id
    rec_case.approved_by_user_id = member.user_id
    db.commit()

    return {
        "status": "Approved",
        "case_number": rec_case.case_number,
        "approved_scenario_id": rec_case.approved_scenario_id,
        "message": "Recovery plan approved and executed in operational ledger."
    }
