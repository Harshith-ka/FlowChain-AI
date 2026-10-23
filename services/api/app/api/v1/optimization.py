from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_org_member, RequireRole
from app.models.organization import OrganizationMember, UserRole
from app.models.disruption import Disruption
from app.optimization.models import OptimizationInput, OptimizationSolution
from app.optimization.solver import solve_recovery_optimization

router = APIRouter(prefix="/optimization", tags=["Optimization Engine"])

@router.post("/solve", response_model=OptimizationSolution)
def solve_scenario(
    opt_in: OptimizationInput,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(RequireRole([
        UserRole.ORGANIZATION_OWNER,
        UserRole.OPERATIONS_ADMIN,
        UserRole.SUPPLY_CHAIN_MANAGER
    ]))
):
    opt_in.organization_id = member.organization_id
    disruption = db.query(Disruption).filter(
        Disruption.id == opt_in.disruption_id,
        Disruption.organization_id == member.organization_id
    ).first()
    if not disruption:
        raise HTTPException(status_code=404, detail="Disruption record not found")

    solution = solve_recovery_optimization(db=db, opt_input=opt_in)
    return solution

@router.post("/compare")
def compare_strategies(
    disruption_id: str,
    db: Session = Depends(get_db),
    member: OrganizationMember = Depends(get_current_org_member)
) -> Dict[str, Any]:
    """
    Executes all three mathematical optimization formulations (Cost-First, Speed-First, Balanced)
    to generate distinct, non-dominated Pareto strategies for decision comparison.
    """
    disruption = db.query(Disruption).filter(
        Disruption.id == disruption_id,
        Disruption.organization_id == member.organization_id
    ).first()
    if not disruption:
        raise HTTPException(status_code=404, detail="Disruption record not found")

    modes = ["Cost-First", "Balanced", "Speed-First"]
    solutions = []
    for mode in modes:
        inp = OptimizationInput(
            disruption_id=disruption_id,
            organization_id=member.organization_id,
            objective_mode=mode,
            max_solver_time_ms=5000
        )
        sol = solve_recovery_optimization(db=db, opt_input=inp)
        solutions.append(sol)

    return {
        "disruption_id": disruption_id,
        "disruption_title": disruption.title,
        "strategies_compared": len(solutions),
        "solutions": solutions,
        "recommended_strategy": "Balanced Strategy",
        "recommended_solution_id": solutions[1].solution_id if len(solutions) > 1 else solutions[0].solution_id
    }
