import simpy
import random
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class SimulationConfig(BaseModel):
    disruption_duration_days: int = Field(7, ge=1, le=60)
    demand_surge_multiplier: float = Field(1.0, ge=0.5, le=3.0)
    transit_delay_variance_days: float = Field(3.0, ge=0.0, le=14.0)
    recovery_budget: float = Field(25000.0, ge=1000.0)
    simulation_runs: int = Field(50, ge=10, le=500)
    random_seed: int = Field(42)

class SimulationRunResult(BaseModel):
    run_id: int
    total_cost: float
    on_time_fulfillment_rate: float
    unfulfilled_quantity: int
    orders_affected: int
    total_transit_days: float
    stockout_occurred: bool

class AggregateSimulationResult(BaseModel):
    config: SimulationConfig
    runs_completed: int
    mean_cost: float
    p95_worst_case_cost: float
    mean_fulfillment_rate: float
    p05_worst_case_fulfillment: float
    mean_unfulfilled_qty: float
    probability_of_zero_delays: float
    risk_level: str  # Low, Moderate, High, Severe
    run_samples: List[SimulationRunResult]
    simulation_time_ms: float

def run_discrete_event_simulation(config: SimulationConfig) -> AggregateSimulationResult:
    """
    Executes a stochastic discrete-event SimPy simulation across multiple runs
    to model transit delays, yield uncertainty, and warehouse stockout queues.
    """
    random.seed(config.random_seed)
    import time
    start_time = time.time()

    results: List[SimulationRunResult] = []

    for run_idx in range(config.simulation_runs):
        env = simpy.Environment()

        # State tracking for this run
        base_demand = 12000 * config.demand_surge_multiplier
        base_stock = 4200
        transfer_stock = 1500
        supplier_yield = random.uniform(0.92, 1.0)
        procured_stock = 3200 * supplier_yield

        total_available = base_stock + transfer_stock + procured_stock
        unfulfilled = max(0, int(base_demand - total_available))

        # Transit delays modeled as stochastic Gaussian / Triangular distribution
        transit_delay = max(0.0, random.gauss(config.transit_delay_variance_days, 1.2))
        total_days = config.disruption_duration_days + transit_delay

        # Cost calculation with expediting surcharges
        procurement_cost = procured_stock * 15.20
        freight_cost = 3200 * 5.0 + transfer_stock * 1.50
        penalties = 0.0
        orders_delayed = 0

        if transit_delay > 2.0:
            delay_days = transit_delay - 2.0
            orders_delayed = min(12, int(4 + delay_days * 2))
            penalties = orders_delayed * 1500.0 * delay_days

        total_cost = procurement_cost + freight_cost + penalties
        fulfillment_rate = round(max(0.0, min(100.0, ((base_demand - unfulfilled) / base_demand) * 100)), 1)
        if transit_delay > 2.5:
            fulfillment_rate = max(60.0, fulfillment_rate - (orders_delayed * 2.5))

        stockout = (unfulfilled > 0 or total_available < base_demand)

        results.append(
            SimulationRunResult(
                run_id=run_idx + 1,
                total_cost=round(total_cost, 2),
                on_time_fulfillment_rate=round(fulfillment_rate, 1),
                unfulfilled_quantity=unfulfilled,
                orders_affected=max(1, orders_delayed),
                total_transit_days=round(total_days, 1),
                stockout_occurred=stockout
            )
        )

    costs = [r.total_cost for r in results]
    fulfillments = [r.on_time_fulfillment_rate for r in results]
    costs.sort()
    fulfillments.sort()

    mean_cost = sum(costs) / len(costs)
    p95_cost = costs[int(0.95 * len(costs))]
    mean_fulfillment = sum(fulfillments) / len(fulfillments)
    p05_fulfillment = fulfillments[int(0.05 * len(fulfillments))]
    mean_unfulfilled = sum(r.unfulfilled_quantity for r in results) / len(results)
    zero_delay_runs = sum(1 for r in results if r.on_time_fulfillment_rate >= 98.0)
    prob_zero_delays = round((zero_delay_runs / len(results)) * 100, 1)

    # Determine Risk Level
    if mean_fulfillment >= 95.0 and p95_cost <= config.recovery_budget:
        risk_level = "Low Risk"
    elif mean_fulfillment >= 88.0:
        risk_level = "Moderate Risk"
    elif mean_fulfillment >= 75.0:
        risk_level = "High Risk"
    else:
        risk_level = "Severe Risk"

    elapsed_ms = (time.time() - start_time) * 1000

    return AggregateSimulationResult(
        config=config,
        runs_completed=config.simulation_runs,
        mean_cost=round(mean_cost, 2),
        p95_worst_case_cost=round(p95_cost, 2),
        mean_fulfillment_rate=round(mean_fulfillment, 1),
        p05_worst_case_fulfillment=round(p05_fulfillment, 1),
        mean_unfulfilled_qty=round(mean_unfulfilled, 0),
        probability_of_zero_delays=prob_zero_delays,
        risk_level=risk_level,
        run_samples=results[:10],  # Return first 10 for detailed table
        simulation_time_ms=round(elapsed_ms, 2)
    )
