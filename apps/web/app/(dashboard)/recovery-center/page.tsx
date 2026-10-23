"use client";

import { useState } from "react";
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Bot,
  ShieldCheck,
  TrendingDown,
  Clock,
  DollarSign,
  ArrowRight
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function RecoveryCenterPage() {
  const [selectedPlan, setSelectedPlan] = useState<"cost" | "speed" | "balanced">("balanced");
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "executing" | "completed">("pending");

  const plans = {
    cost: {
      name: "Strategy A: Cost-First",
      cost: 12400,
      deliveryLatenessDays: 2.1,
      ordersFulfilledPercent: 88.0,
      delayRisk: "Medium (34% variance)",
      suppliersActivated: "None (Internal transfer only)",
      routeChanges: "Ground freight transfer from WH-02",
      penaltyIncurred: 14000,
      agentRecommendation: "Optimal when monetary budget is strictly capped below $15k.",
    },
    balanced: {
      name: "Strategy B: Balanced (Recommended)",
      cost: 18450,
      deliveryLatenessDays: 0.0,
      ordersFulfilledPercent: 98.4,
      delayRisk: "Low (8% variance)",
      suppliersActivated: "Tokyo Micro Systems (SP-01) for 3,200 pcs",
      routeChanges: "Express Air freight on 2 critical customer orders",
      penaltyIncurred: 0,
      agentRecommendation: "Recommended by Recovery Orchestrator. Maximizes customer retention and avoids $92,000 late penalties for only +$6,050 incremental freight.",
    },
    speed: {
      name: "Strategy C: Speed-First",
      cost: 29800,
      deliveryLatenessDays: 0.0,
      ordersFulfilledPercent: 100.0,
      delayRisk: "Negligible (<2% variance)",
      suppliersActivated: "Tokyo Micro Systems (SP-01) + Penang (SP-08)",
      routeChanges: "Full chartered cargo air freight for all 12 orders",
      penaltyIncurred: 0,
      agentRecommendation: "Delivers maximum operational certainty with zero delays regardless of secondary port bottlenecks.",
    }
  };

  const handleApprove = () => {
    setApprovalStatus("approved");
    setTimeout(() => {
      setApprovalStatus("executing");
      setTimeout(() => {
        setApprovalStatus("completed");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <GitCompare className="w-5 h-5 text-brand-light" />
            <span>Autonomous Recovery Center & Scenario Comparison</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Compare non-dominated Pareto recovery strategies computed by Google OR-Tools and execute human-approved plans.
          </p>
        </div>

        {approvalStatus === "completed" ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-green/20 border border-status-green/40 text-status-green text-xs font-bold font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>SIMULATED EXECUTION COMPLETED</span>
          </div>
        ) : approvalStatus === "executing" ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue/20 border border-brand-blue/40 text-brand-light text-xs font-bold font-mono animate-pulse">
            <RotateCcw className="w-4 h-4 animate-spin" />
            <span>EXECUTING ALLOCATIONS...</span>
          </div>
        ) : (
          <button
            onClick={handleApprove}
            className="px-5 py-2.5 rounded-lg bg-status-green hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-glow transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approve & Execute {plans[selectedPlan].name.split(":")[0]}</span>
          </button>
        )}
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-xl glass-panel-elevated border border-border overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface/90 border-b border-border text-text-muted font-mono uppercase text-[10px]">
            <tr>
              <th className="py-4 px-5">Operational Metric</th>
              <th
                onClick={() => setSelectedPlan("cost")}
                className={`py-4 px-5 cursor-pointer transition-colors ${selectedPlan === "cost" ? "bg-surface-elevated text-brand-light font-bold border-t-2 border-brand-blue" : "hover:text-text-primary"}`}
              >
                Cost-First Strategy
              </th>
              <th
                onClick={() => setSelectedPlan("balanced")}
                className={`py-4 px-5 cursor-pointer transition-colors ${selectedPlan === "balanced" ? "bg-surface-elevated text-accent-cyan font-bold border-t-2 border-accent-cyan" : "hover:text-text-primary"}`}
              >
                <div className="flex items-center gap-1.5">
                  <span>Balanced Strategy</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40">
                    Recommended
                  </span>
                </div>
              </th>
              <th
                onClick={() => setSelectedPlan("speed")}
                className={`py-4 px-5 cursor-pointer transition-colors ${selectedPlan === "speed" ? "bg-surface-elevated text-purple-400 font-bold border-t-2 border-purple-500" : "hover:text-text-primary"}`}
              >
                Speed-First Strategy
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            <tr>
              <td className="py-3 px-5 text-text-muted font-medium">Recovery Cost</td>
              <td className={`py-3 px-5 font-mono font-bold ${selectedPlan === "cost" ? "bg-surface-elevated/40" : ""}`}>
                {formatCurrency(plans.cost.cost)}
              </td>
              <td className={`py-3 px-5 font-mono font-bold text-accent-cyan ${selectedPlan === "balanced" ? "bg-surface-elevated/40" : ""}`}>
                {formatCurrency(plans.balanced.cost)}
              </td>
              <td className={`py-3 px-5 font-mono font-bold ${selectedPlan === "speed" ? "bg-surface-elevated/40" : ""}`}>
                {formatCurrency(plans.speed.cost)}
              </td>
            </tr>

            <tr>
              <td className="py-3 px-5 text-text-muted font-medium">Delivery Lateness SLA</td>
              <td className={`py-3 px-5 font-mono text-status-amber ${selectedPlan === "cost" ? "bg-surface-elevated/40" : ""}`}>
                +2.1 Days Delayed
              </td>
              <td className={`py-3 px-5 font-mono text-status-green font-bold ${selectedPlan === "balanced" ? "bg-surface-elevated/40" : ""}`}>
                0 Days (On Time)
              </td>
              <td className={`py-3 px-5 font-mono text-status-green font-bold ${selectedPlan === "speed" ? "bg-surface-elevated/40" : ""}`}>
                0 Days (On Time)
              </td>
            </tr>

            <tr>
              <td className="py-3 px-5 text-text-muted font-medium">Customer On-Time Rate</td>
              <td className={`py-3 px-5 font-mono ${selectedPlan === "cost" ? "bg-surface-elevated/40" : ""}`}>
                {plans.cost.ordersFulfilledPercent}%
              </td>
              <td className={`py-3 px-5 font-mono font-bold text-status-green ${selectedPlan === "balanced" ? "bg-surface-elevated/40" : ""}`}>
                {plans.balanced.ordersFulfilledPercent}%
              </td>
              <td className={`py-3 px-5 font-mono font-bold text-status-green ${selectedPlan === "speed" ? "bg-surface-elevated/40" : ""}`}>
                {plans.speed.ordersFulfilledPercent}%
              </td>
            </tr>

            <tr>
              <td className="py-3 px-5 text-text-muted font-medium">Delay Penalty Exposure</td>
              <td className={`py-3 px-5 font-mono text-status-red ${selectedPlan === "cost" ? "bg-surface-elevated/40" : ""}`}>
                ${formatNumber(plans.cost.penaltyIncurred)}
              </td>
              <td className={`py-3 px-5 font-mono text-status-green font-bold ${selectedPlan === "balanced" ? "bg-surface-elevated/40" : ""}`}>
                $0 (Avoided)
              </td>
              <td className={`py-3 px-5 font-mono text-status-green font-bold ${selectedPlan === "speed" ? "bg-surface-elevated/40" : ""}`}>
                $0 (Avoided)
              </td>
            </tr>

            <tr>
              <td className="py-3 px-5 text-text-muted font-medium">Supplier Changes</td>
              <td className={`py-3 px-5 text-text-secondary ${selectedPlan === "cost" ? "bg-surface-elevated/40" : ""}`}>
                {plans.cost.suppliersActivated}
              </td>
              <td className={`py-3 px-5 text-text-primary font-medium ${selectedPlan === "balanced" ? "bg-surface-elevated/40" : ""}`}>
                {plans.balanced.suppliersActivated}
              </td>
              <td className={`py-3 px-5 text-text-secondary ${selectedPlan === "speed" ? "bg-surface-elevated/40" : ""}`}>
                {plans.speed.suppliersActivated}
              </td>
            </tr>

            <tr>
              <td className="py-3 px-5 text-text-muted font-medium">Logistics Rerouting</td>
              <td className={`py-3 px-5 text-text-secondary ${selectedPlan === "cost" ? "bg-surface-elevated/40" : ""}`}>
                {plans.cost.routeChanges}
              </td>
              <td className={`py-3 px-5 text-text-primary font-medium ${selectedPlan === "balanced" ? "bg-surface-elevated/40" : ""}`}>
                {plans.balanced.routeChanges}
              </td>
              <td className={`py-3 px-5 text-text-secondary ${selectedPlan === "speed" ? "bg-surface-elevated/40" : ""}`}>
                {plans.speed.routeChanges}
              </td>
            </tr>

            <tr>
              <td className="py-3 px-5 text-text-muted font-medium">Risk Score (SimPy)</td>
              <td className={`py-3 px-5 text-text-secondary font-mono ${selectedPlan === "cost" ? "bg-surface-elevated/40" : ""}`}>
                {plans.cost.delayRisk}
              </td>
              <td className={`py-3 px-5 text-status-green font-bold font-mono ${selectedPlan === "balanced" ? "bg-surface-elevated/40" : ""}`}>
                {plans.balanced.delayRisk}
              </td>
              <td className={`py-3 px-5 text-text-secondary font-mono ${selectedPlan === "speed" ? "bg-surface-elevated/40" : ""}`}>
                {plans.speed.delayRisk}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Selected Strategy Deep-Dive & Recommendation Card */}
      <div className="p-6 rounded-xl glass-panel-elevated border-2 border-brand-blue/50 shadow-glow space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              AI Orchestrator Recommendation Rationale: {plans[selectedPlan].name}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Formulated via Google OR-Tools MIP solver with strict flow conservation and capacity verification.
            </p>
          </div>
        </div>

        <p className="text-xs text-text-primary leading-relaxed bg-surface p-4 rounded-lg border border-border">
          {plans[selectedPlan].agentRecommendation}
        </p>
      </div>
    </div>
  );
}
