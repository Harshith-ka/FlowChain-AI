from fastapi import APIRouter, Depends
from app.core.deps import get_current_org_member
from app.models.organization import OrganizationMember
from app.simulation.engine import (
    SimulationConfig,
    AggregateSimulationResult,
    run_discrete_event_simulation
)

router = APIRouter(prefix="/simulations", tags=["Simulation Engine"])

@router.post("/run", response_model=AggregateSimulationResult)
def run_simulation(
    config: SimulationConfig,
    member: OrganizationMember = Depends(get_current_org_member)
):
    result = run_discrete_event_simulation(config=config)
    return result
