"use client";

import { useState } from "react";
import {
  Bot,
  Activity,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Play
} from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 50, y: 120 },
    data: { label: "1. Disruption Intelligence" },
    style: { background: "#1E1014", color: "#EF4444", border: "1px solid #EF4444", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", width: 170 }
  },
  {
    id: "2",
    position: { x: 280, y: 40 },
    data: { label: "2. Supplier Recovery" },
    style: { background: "#111827", color: "#60A5FA", border: "1px solid #3B82F6", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", width: 160 }
  },
  {
    id: "3",
    position: { x: 280, y: 200 },
    data: { label: "3. Inventory Optimization" },
    style: { background: "#111827", color: "#06B6D4", border: "1px solid #06B6D4", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", width: 160 }
  },
  {
    id: "4",
    position: { x: 500, y: 120 },
    data: { label: "4. Logistics Routing" },
    style: { background: "#111827", color: "#C084FC", border: "1px solid #A855F7", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", width: 160 }
  },
  {
    id: "5",
    position: { x: 720, y: 40 },
    data: { label: "5. OR-Tools MIP Solver" },
    style: { background: "#0F2338", color: "#38BDF8", border: "1px solid #0284C7", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", width: 170 }
  },
  {
    id: "6",
    position: { x: 720, y: 200 },
    data: { label: "6. Cost & Risk Agent" },
    style: { background: "#1F1B12", color: "#FBBF24", border: "1px solid #F59E0B", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", width: 160 }
  },
  {
    id: "7",
    position: { x: 950, y: 120 },
    data: { label: "7. Recovery Orchestrator (HITL)" },
    style: { background: "#0D281E", color: "#34D399", border: "2px solid #10B981", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", width: 190 }
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#3B82F6" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "#06B6D4" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e2-4", source: "2", target: "4", style: { stroke: "#3B82F6" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3-4", source: "3", target: "4", style: { stroke: "#06B6D4" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e4-5", source: "4", target: "5", animated: true, style: { stroke: "#38BDF8" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e5-6", source: "5", target: "6", style: { stroke: "#F59E0B" }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e6-7", source: "6", target: "7", animated: true, style: { stroke: "#10B981" }, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function AgentCenterPage() {
  const [selectedAgent, setSelectedAgent] = useState("Recovery Orchestrator");
  const [isRunning, setIsRunning] = useState(false);

  const agents = [
    { name: "Disruption Intelligence Agent", role: "Graph Traversal & Blast Radius", status: "Completed", latency: "42ms", toolsCalled: ["get_disruption", "get_affected_orders", "get_dependencies"], output: "Identified 12 customer orders at risk across 2 SKUs (MCU-X8, RAM-32G)." },
    { name: "Supplier Recovery Agent", role: "Alternative Sourcing Search", status: "Completed", latency: "68ms", toolsCalled: ["search_suppliers", "check_capacity", "get_prices"], output: "Evaluated 7 alternative suppliers. Tokyo Micro Systems (SP-01) has 3,200 units available." },
    { name: "Inventory Optimization Agent", role: "ATP & Stock Allocation", status: "Completed", latency: "54ms", toolsCalled: ["get_inventory_positions", "propose_stock_transfers"], output: "Formulated lateral warehouse transfer of 1,500 units from Warehouse B (Rotterdam)." },
    { name: "Logistics Routing Agent", role: "NetworkX Multi-Modal Routing", status: "Completed", latency: "89ms", toolsCalled: ["find_feasible_paths", "get_route_capacity"], output: "Discovered Express Air route Tokyo → Singapore (24hr transit) and Rail transfer Rotterdam → Frankfurt." },
    { name: "Cost & Risk Agent", role: "Deterministic Surcharge Accounting", status: "Completed", latency: "38ms", toolsCalled: ["calculate_procurement", "calculate_penalties", "risk_score"], output: "Calculated exact recovery cost: $18,450. Avoids $92,000 late penalties." },
    { name: "Recovery Orchestrator", role: "MIP Solver Invocation & HITL", status: "Awaiting Human Sign-off", latency: "18ms (Solver)", toolsCalled: ["run_ortools_mip", "compile_tradeoffs"], output: "Compiled 3 non-dominated Pareto strategies. Recommends Balanced Strategy B." },
  ];

  const current = agents.find(a => a.name === selectedAgent) || agents[5];

  const handleRunWorkflow = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-accent-cyan" />
            <span>AI Agent Observability Center & LangGraph Workflows</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time stateful DAG execution, tool invocations, Google OR-Tools solver execution, and human interrupts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-semibold flex items-center gap-2 shadow-glow transition-all disabled:opacity-50"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-accent-cyan" />}
            <span>{isRunning ? "Orchestrating Agents..." : "Trigger LangGraph Workflow"}</span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-green/15 text-status-green border border-status-green/30 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
            <span>6/6 AGENTS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Interactive React Flow Workflow DAG */}
      <div className="rounded-xl glass-panel-elevated border border-border p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-text-muted font-mono">
          <span>LangGraph Multi-Agent Stateful Orchestration DAG</span>
          <span className="text-accent-cyan">Thread ID: #24906b05-WORKFLOW</span>
        </div>
        <div className="h-64 w-full bg-[#050914] rounded-lg border border-border/80 overflow-hidden relative">
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#1E293B" gap={16} />
            <Controls className="bg-surface border-border text-text-primary" />
          </ReactFlow>
        </div>
      </div>

      {/* Main Layout: 6 Agents List & Trace Log Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents List (1 col) */}
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.name}
              onClick={() => setSelectedAgent(agent.name)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedAgent === agent.name ? "bg-surface-elevated border-brand-blue shadow-glow" : "glass-panel border-border hover:border-border/80"}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{agent.name}</h4>
                  <div className="text-[11px] text-text-secondary mt-0.5">{agent.role}</div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${agent.status.includes("Awaiting") ? "bg-status-amber/20 text-status-amber border border-status-amber/30" : "bg-status-green/20 text-status-green border border-status-green/30"}`}>
                  {agent.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50 text-[10px] text-text-muted font-mono">
                <span>Latency: {agent.latency}</span>
                <span>{agent.toolsCalled.length} tools invoked</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trace Inspector (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl glass-panel-elevated border border-border space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">{current.name}</h3>
                <p className="text-xs text-text-muted">Execution Checkpoint #24906b05-STEP-08</p>
              </div>
            </div>
            <span className="font-mono text-xs text-accent-cyan">Thread State: Synchronized</span>
          </div>

          {/* Tools Called */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-text-muted mb-2">
              Deterministic Tool Invocations
            </h4>
            <div className="flex flex-wrap gap-2">
              {current.toolsCalled.map((tool) => (
                <span key={tool} className="px-2.5 py-1 rounded bg-surface border border-border font-mono text-xs text-brand-light">
                  {tool}()
                </span>
              ))}
            </div>
          </div>

          {/* Structured Output */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-text-muted mb-2">
              Machine-Readable Proposal Output
            </h4>
            <div className="p-4 rounded-lg bg-[#050914] border border-border font-mono text-xs text-text-primary leading-relaxed">
              {current.output}
            </div>
          </div>

          {/* Persistent Checkpoint State Preview */}
          <div className="p-4 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-text-muted font-mono">LangGraph Persistent Checkpointer</span>
              <span className="text-status-green font-mono">Postgres / Memory</span>
            </div>
            <p className="text-[11px] text-text-secondary leading-snug">
              Human-in-the-loop interrupt active. Recovery plan execution blocked until explicit manager authorization is granted in Recovery Center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
