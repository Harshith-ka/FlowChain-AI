from typing import TypedDict, List, Dict, Any, Optional
from pydantic import BaseModel

class AgentProposal(BaseModel):
    agent_name: str
    proposal_type: str  # Sourcing, InventoryTransfer, Routing, RiskAnalysis
    title: str
    details: Dict[str, Any]
    summary_text: str

class AgentTraceStep(BaseModel):
    agent_name: str
    step_type: str  # Thought, ToolCall, Proposal, Checkpoint, Interrupt
    content: str
    tool_name: Optional[str] = None
    tool_args: Optional[Dict[str, Any]] = None
    tool_result: Optional[Any] = None
    timestamp: str

class RecoveryAgentState(TypedDict):
    disruption_id: str
    organization_id: str
    disruption_details: Dict[str, Any]
    affected_skus: List[str]
    impact_summary: Dict[str, Any]
    supplier_proposals: List[Dict[str, Any]]
    inventory_proposals: List[Dict[str, Any]]
    logistics_proposals: List[Dict[str, Any]]
    solver_solutions: List[Dict[str, Any]]
    cost_risk_evaluations: List[Dict[str, Any]]
    final_recommendation: Optional[Dict[str, Any]]
    is_interrupted_for_human_approval: bool
    is_approved: bool
    current_phase: str
    trace_steps: List[Dict[str, Any]]
    error: Optional[str]
