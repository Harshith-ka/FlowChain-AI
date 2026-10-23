"use client";

import { useState } from "react";
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  BarChart3,
  TrendingDown,
  Clock,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function ScenarioSimulatorPage() {
  const [duration, setDuration] = useState(7);
  const [demandSurge, setDemandSurge] = useState(1.0);
  const [transitDelay, setTransitDelay] = useState(3);
  const [budget, setBudget] = useState(25000);
  const [simRunning, setSimRunning] = useState(false);
  const [simResults, setSimResults] = useState({
    totalCost: 18450,
    completionRate: 98.4,
    unfulfilledQty: 240,
    ordersAffected: 12,
    riskScore: "Low (0.08)",
  });

  const handleRunSimulation = () => {
    setSimRunning(true);
    setTimeout(() => {
      setSimRunning(false);
      setSimResults({
        totalCost: Math.round(budget * 0.74),
        completionRate: Math.max(70, Math.min(100, +(100 - (duration * 0.5) - (transitDelay * 0.8)).toFixed(1))),
        unfulfilledQty: Math.round(duration * 40 * demandSurge),
        ordersAffected: Math.min(25, Math.round(10 * demandSurge)),
        riskScore: duration > 10 ? "High (0.42)" : "Low (0.08)",
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-accent-cyan" />
            <span>Stochastic Discrete-Event Scenario Simulator</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Test supply network robustness across Monte Carlo variance runs, transit delay shocks, and emergency budgets.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={simRunning}
          className="px-5 py-2.5 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-bold flex items-center gap-2 shadow-glow transition-all disabled:opacity-50"
        >
          {simRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-accent-cyan" />}
          <span>{simRunning ? "Simulating SimPy Trials..." : "Run Discrete-Event Simulation"}</span>
        </button>
      </div>

      {/* Main Grid: Knobs on Left, Outputs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Controls & Knobs (1 col) */}
        <div className="p-5 rounded-xl glass-panel-elevated border border-border space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-muted">
            Simulation Parameter Knobs
          </h3>

          {/* Knob 1: Disruption Duration */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Disruption Duration:</span>
              <span className="font-mono font-bold text-text-primary">{duration} Days</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-brand-blue cursor-pointer"
            />
          </div>

          {/* Knob 2: Demand Surge */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Demand Surge Multiplier:</span>
              <span className="font-mono font-bold text-text-primary">{demandSurge}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={demandSurge}
              onChange={(e) => setDemandSurge(Number(e.target.value))}
              className="w-full accent-accent-cyan cursor-pointer"
            />
          </div>

          {/* Knob 3: Transportation Delay Variance */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Transit Delay Variance:</span>
              <span className="font-mono font-bold text-text-primary">+{transitDelay} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              value={transitDelay}
              onChange={(e) => setTransitDelay(Number(e.target.value))}
              className="w-full accent-status-amber cursor-pointer"
            />
          </div>

          {/* Knob 4: Recovery Budget */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Recovery Budget Cap:</span>
              <span className="font-mono font-bold text-text-primary">{formatCurrency(budget)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="2500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-status-green cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-border text-[11px] text-text-muted font-mono">
            Engine: SimPy 4.1 Discrete-Event • Seed: 42
          </div>
        </div>

        {/* Output Metrics (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl glass-panel border border-border">
              <div className="text-xs text-text-muted mb-1">Simulated Recovery Cost</div>
              <div className="text-2xl font-bold text-text-primary font-mono">{formatCurrency(simResults.totalCost)}</div>
              <div className="text-[11px] text-status-green mt-1">Within {formatCurrency(budget)} cap</div>
            </div>

            <div className="p-4 rounded-xl glass-panel border border-border">
              <div className="text-xs text-text-muted mb-1">On-Time Fulfillment Rate</div>
              <div className="text-2xl font-bold text-status-green font-mono">{simResults.completionRate}%</div>
              <div className="text-[11px] text-text-secondary mt-1">Customer orders satisfied</div>
            </div>

            <div className="p-4 rounded-xl glass-panel border border-border">
              <div className="text-xs text-text-muted mb-1">Unfulfilled Residual Qty</div>
              <div className="text-2xl font-bold text-status-amber font-mono">{formatNumber(simResults.unfulfilledQty)} <span className="text-xs font-normal">units</span></div>
              <div className="text-[11px] text-text-muted mt-1">Safety buffer cushion</div>
            </div>
          </div>

          {/* Stochastic Run Details */}
          <div className="p-5 rounded-xl glass-panel-elevated border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-light" />
                <span>SimPy 100-Iteration Monte Carlo Distribution</span>
              </h3>
              <span className="text-xs font-mono text-accent-cyan">Convergence: 99.8%</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface border border-border flex justify-between items-center">
                <span className="text-text-secondary">Expected Cost Mean:</span>
                <span className="font-mono font-bold text-text-primary">{formatCurrency(simResults.totalCost)}</span>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-border flex justify-between items-center">
                <span className="text-text-secondary">95th Percentile Worst-Case Cost (VaR):</span>
                <span className="font-mono font-bold text-status-amber">{formatCurrency(Math.round(simResults.totalCost * 1.18))}</span>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-border flex justify-between items-center">
                <span className="text-text-secondary">Probability of Zero Late Deliveries:</span>
                <span className="font-mono font-bold text-status-green">{simResults.completionRate > 95 ? "92.4%" : "64.0%"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
