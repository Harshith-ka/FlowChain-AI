"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Zap,
  Globe2,
  Cpu,
  BarChart3,
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  GitBranch,
  Layers,
  Scale
} from "lucide-react";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-brand-blue/30 selection:text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-border/80 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-blue to-accent-cyan flex items-center justify-center shadow-glow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              FlowChain <span className="text-xs px-1.5 py-0.5 rounded bg-brand-blue/20 text-brand-light font-mono border border-brand-blue/30">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#twin" className="hover:text-text-primary transition-colors">Digital Twin</a>
            <a href="#agents" className="hover:text-text-primary transition-colors">6 AI Agents</a>
            <a href="#optimization" className="hover:text-text-primary transition-colors">Mathematical Solver</a>
            <a href="#simulation" className="hover:text-text-primary transition-colors">Stochastic Sim</a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-brand-blue hover:bg-brand-light text-white transition-all shadow-glow flex items-center gap-2 group"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated/80 border border-brand-blue/30 text-xs font-mono text-brand-light mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
            <span>Autonomous Supply Chain Recovery & Operations Research</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            Supply Chains Break. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-blue via-accent-cyan to-text-primary bg-clip-text text-transparent">
              Your Operations Don't Have To.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-10">
            FlowChain AI detects disruptions, simulates stochastic recovery strategies, and coordinates six specialized AI agents with mathematical optimization to keep global logistics moving.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-light text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2.5 transition-all group"
            >
              <Zap className="w-4 h-4 text-accent-cyan" />
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/network"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-text-primary font-semibold text-sm flex items-center justify-center gap-2.5 transition-all"
            >
              <Globe2 className="w-4 h-4 text-brand-light" />
              <span>Explore Digital Twin</span>
            </Link>
          </div>

          {/* Hero Supply Chain Recovery Animated Visual Component */}
          <div className="max-w-5xl mx-auto rounded-2xl glass-panel-elevated p-6 border border-border/80 shadow-2xl relative overflow-hidden">
            {/* Control Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-status-red animate-ping" />
                <span className="font-mono text-status-red font-semibold uppercase tracking-wider">
                  Live Simulation: Supplier #SP-04 Shenzhen Disrupted
                </span>
              </div>
              <div className="flex items-center gap-2 text-text-muted font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-surface border border-border">MIP Solver: Active</span>
                <span className="px-2 py-0.5 rounded bg-brand-blue/20 text-brand-light border border-brand-blue/30">Latency: 18ms</span>
              </div>
            </div>

            {/* Interactive Animated Network Topology Canvas/SVG */}
            <div className="relative h-72 sm:h-80 w-full bg-[#050914] rounded-xl border border-border/60 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Defs for gradients & patterns */}
                <defs>
                  <linearGradient id="healthyRoute" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="disruptedRoute" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="recoveryRoute" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Normal Routes */}
                <path d="M 120 70 Q 260 50 400 110" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                <path d="M 400 110 Q 550 90 680 120" stroke="#10B981" strokeWidth="2.5" opacity="0.7" />
                <path d="M 400 210 Q 550 230 680 200" stroke="#10B981" strokeWidth="2" opacity="0.7" />

                {/* Disrupted Route (Red Broken Line) */}
                <path d="M 120 230 Q 250 250 400 210" stroke="url(#disruptedRoute)" strokeWidth="3" strokeDasharray="6 4" />

                {/* Proposed Recovery Route (Glowing Cyan Arc) */}
                <path d="M 120 70 Q 280 180 400 210" stroke="url(#recoveryRoute)" strokeWidth="3.5" className="animate-pulse" />

                {/* Node 1: Supplier SP-01 (Tokyo - Healthy) */}
                <g transform="translate(120, 70)">
                  <circle r="20" fill="#111827" stroke="#10B981" strokeWidth="2" />
                  <circle r="6" fill="#10B981" />
                  <text y="35" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">SP-01 (Tokyo)</text>
                  <text y="48" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace">98% OTD</text>
                </g>

                {/* Node 2: Supplier SP-04 (Shenzhen - DISRUPTED) */}
                <g transform="translate(120, 230)">
                  <circle r="22" fill="#1E1014" stroke="#EF4444" strokeWidth="2.5" className="animate-pulse" />
                  <circle r="7" fill="#EF4444" />
                  <text y="36" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="bold" fontFamily="sans-serif">SP-04 (Disrupted)</text>
                  <text y="49" textAnchor="middle" fill="#F87171" fontSize="9" fontFamily="monospace">7-Day Delay</text>
                </g>

                {/* Node 3: Central Warehouse / Hub (Singapore) */}
                <g transform="translate(400, 110)">
                  <rect x="-18" y="-18" width="36" height="36" rx="8" fill="#1B2435" stroke="#3B82F6" strokeWidth="2" />
                  <circle r="5" fill="#3B82F6" />
                  <text y="32" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontFamily="sans-serif">Central Hub A</text>
                  <text y="44" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">14,200 Units</text>
                </g>

                {/* Node 4: Secondary Warehouse (Rotterdam) */}
                <g transform="translate(400, 210)">
                  <rect x="-18" y="-18" width="36" height="36" rx="8" fill="#1B2435" stroke="#06B6D4" strokeWidth="2" />
                  <circle r="5" fill="#06B6D4" />
                  <text y="32" textAnchor="middle" fill="#06B6D4" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Hub B (Rerouted)</text>
                  <text y="44" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace">+3,200 Stock In</text>
                </g>

                {/* Node 5: Customer Destination 1 (North America) */}
                <g transform="translate(680, 120)">
                  <polygon points="0,-16 16,12 -16,12" fill="#111827" stroke="#10B981" strokeWidth="2" />
                  <circle r="4" fill="#10B981" />
                  <text y="28" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">NA OEM Cluster</text>
                  <text y="40" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace">On Time</text>
                </g>

                {/* Node 6: Customer Destination 2 (EU Assembly) */}
                <g transform="translate(680, 200)">
                  <polygon points="0,-16 16,12 -16,12" fill="#111827" stroke="#3B82F6" strokeWidth="2" />
                  <circle r="4" fill="#3B82F6" />
                  <text y="28" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontFamily="sans-serif">EU Assembly Plants</text>
                  <text y="40" textAnchor="middle" fill="#3B82F6" fontSize="9" fontFamily="monospace">Recovered via Air</text>
                </g>
              </svg>

              {/* Floating Agent Recommendation Overlay */}
              <div className="absolute bottom-3 right-3 max-w-xs glass-panel p-3 rounded-lg border border-brand-blue/40 shadow-glow text-left">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-brand-light">
                  <Bot className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Recovery Orchestrator Recommendation</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-snug">
                  Shift 3,200 units from Tokyo via Express Air freight. 98.4% customer on-time fulfillment saved at +$14,200 cost.
                </p>
              </div>
            </div>

            {/* Bottom Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/60 text-left">
              <div>
                <div className="text-[11px] text-text-muted uppercase font-mono">Disruption Severity</div>
                <div className="text-lg font-bold text-status-red flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Tier 1 Critical</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-text-muted uppercase font-mono">Orders Protected</div>
                <div className="text-lg font-bold text-status-green flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>42 of 44 (95.5%)</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-text-muted uppercase font-mono">Recovery Cost</div>
                <div className="text-lg font-bold text-text-primary">$18,450</div>
              </div>
              <div>
                <div className="text-[11px] text-text-muted uppercase font-mono">Resolution Time</div>
                <div className="text-lg font-bold text-accent-cyan">4.2 min vs 7 days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Specialized Agents Section */}
      <section id="agents" className="py-24 border-b border-border/60 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-accent-cyan mb-3">Agentic AI Architecture</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Six Autonomous Specialists. One Seamless Workflow.
            </h3>
            <p className="text-text-secondary text-sm sm:text-base">
              Unlike generic chat assistants, FlowChain AI deploys deterministic LangGraph agents equipped with specialized tools, rigorous constraint checks, and mathematical solvers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Agent 1 */}
            <div className="p-6 rounded-xl glass-panel-elevated border border-border/80 hover:border-brand-blue/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-status-red/10 border border-status-red/30 flex items-center justify-center text-status-red mb-4 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-text-primary mb-2">1. Disruption Intelligence Agent</h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Listens to telemetry, port alerts, and manual events. Traverses the supply graph to build a deterministic blast-radius impact summary.
              </p>
              <div className="text-[10px] font-mono text-text-muted bg-surface p-2 rounded border border-border">
                Tools: get_disruption, get_affected_orders, get_dependencies
              </div>
            </div>

            {/* Agent 2 */}
            <div className="p-6 rounded-xl glass-panel-elevated border border-border/80 hover:border-brand-blue/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-light mb-4 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-text-primary mb-2">2. Supplier Recovery Agent</h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Queries alternative certified suppliers, compares lead times, checks stored capacity constraints, and generates replacement sourcing bids.
              </p>
              <div className="text-[10px] font-mono text-text-muted bg-surface p-2 rounded border border-border">
                Tools: search_suppliers, check_capacity, get_prices
              </div>
            </div>

            {/* Agent 3 */}
            <div className="p-6 rounded-xl glass-panel-elevated border border-border/80 hover:border-brand-blue/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-text-primary mb-2">3. Inventory Optimization Agent</h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Audits regional warehouses for buffer inventory, calculates available-to-promise (ATP), and formulates lateral stock transfers.
              </p>
              <div className="text-[10px] font-mono text-text-muted bg-surface p-2 rounded border border-border">
                Tools: get_inventory_positions, propose_stock_transfers
              </div>
            </div>

            {/* Agent 4 */}
            <div className="p-6 rounded-xl glass-panel-elevated border border-border/80 hover:border-brand-blue/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                <GitBranch className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-text-primary mb-2">4. Logistics Routing Agent</h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Evaluates multi-modal freight routes (Ocean, Rail, Express Air) with NetworkX transit graphs to bypass blocked bottlenecks.
              </p>
              <div className="text-[10px] font-mono text-text-muted bg-surface p-2 rounded border border-border">
                Tools: find_feasible_paths, get_route_capacity, calc_transit
              </div>
            </div>

            {/* Agent 5 */}
            <div className="p-6 rounded-xl glass-panel-elevated border border-border/80 hover:border-brand-blue/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-status-amber/10 border border-status-amber/30 flex items-center justify-center text-status-amber mb-4 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-text-primary mb-2">5. Cost & Risk Evaluation Agent</h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Deterministic accounting of procurement surcharges, expedited freight, handling costs, and contractual late-delivery penalties.
              </p>
              <div className="text-[10px] font-mono text-text-muted bg-surface p-2 rounded border border-border">
                Tools: calculate_procurement, calculate_penalties, risk_score
              </div>
            </div>

            {/* Agent 6 */}
            <div className="p-6 rounded-xl glass-panel-elevated border border-border/80 hover:border-brand-blue/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-status-green/10 border border-status-green/30 flex items-center justify-center text-status-green mb-4 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-text-primary mb-2">6. Recovery Orchestrator Agent</h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Synthesizes agent proposals, executes the OR-Tools MIP solver, compiles non-dominated Pareto strategies, and coordinates human approval.
              </p>
              <div className="text-[10px] font-mono text-text-muted bg-surface p-2 rounded border border-border">
                Tools: run_solver, compile_tradeoffs, request_human_signoff
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Objective Optimization Section */}
      <section id="optimization" className="py-24 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-light mb-3">Mathematical Engine</div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                Constrained Optimization.<br />
                No Hallucinated Decisions.
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Unlike simple generative text wrappers that guess solutions, FlowChain AI models every recovery as a formal Mixed-Integer Programming (MIP) problem solved by Google OR-Tools.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-status-green/20 text-status-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-primary">Flow & Inventory Conservation:</span>
                    <p className="text-xs text-text-secondary">Strict equality constraints guarantee inventory is never double-allocated.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-status-green/20 text-status-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-primary">Time-Indexed Feasibility:</span>
                    <p className="text-xs text-text-secondary">Products cannot arrive before supplier lead times or transit durations permit.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-status-green/20 text-status-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-primary">Honest Infeasibility Diagnostics:</span>
                    <p className="text-xs text-text-secondary">When recovery is mathematically impossible within current budgets, the solver explains exact bottlenecks.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Three Strategies Card */}
            <div className="glass-panel-elevated p-6 rounded-2xl border border-border">
              <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-light" />
                <span>Simulated Pareto Strategies</span>
              </h4>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-surface border border-border hover:border-brand-blue/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-text-primary">1. Cost-First Strategy</span>
                    <span className="text-xs font-mono text-status-green font-bold">$12,400</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">Minimizes surcharges via ground transfers. 88% on-time delivery with 2-day minor delay.</p>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border hover:border-accent-cyan/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-accent-cyan">2. Balanced Strategy (Recommended)</span>
                    <span className="text-xs font-mono text-accent-cyan font-bold">$18,450</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">Blends regional stock shifts with selective air freight. 98.4% fulfillment on-time.</p>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border hover:border-purple-400/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-text-primary">3. Speed-First Strategy</span>
                    <span className="text-xs font-mono text-status-amber font-bold">$29,800</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">Emergency air freight across all priority orders. 100% on-time delivery guaranteed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-b border-border/60 bg-surface/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-brand-light mb-3">Enterprise Pricing</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Predictable Resiliency for Mission-Critical Supply Chains
            </h3>
            <p className="text-text-secondary text-sm">
              Deploy in your cloud or use our enterprise multi-tenant cloud with full tenant isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col justify-between">
              <div>
                <h4 className="text-base font-semibold text-text-primary mb-1">Regional Ops</h4>
                <p className="text-xs text-text-secondary mb-4">For mid-market manufacturers</p>
                <div className="text-3xl font-extrabold text-text-primary mb-6">$1,950<span className="text-xs text-text-muted font-normal"> / mo</span></div>
                <ul className="space-y-2.5 text-xs text-text-secondary mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> Up to 50 Facilities & Warehouses</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> OR-Tools MIP Solver</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> 6 AI Specialist Agents</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> SimPy Discrete Simulator</li>
                </ul>
              </div>
              <Link href="/dashboard" className="w-full py-2.5 rounded-lg bg-surface-elevated hover:bg-surface-highlight border border-border text-center text-xs font-semibold">
                Get Started
              </Link>
            </div>

            {/* Enterprise Highlighted */}
            <div className="glass-panel-elevated p-6 rounded-2xl border-2 border-brand-blue flex flex-col justify-between relative shadow-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-blue text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                Most Popular
              </div>
              <div>
                <h4 className="text-base font-semibold text-text-primary mb-1">Global Resiliency</h4>
                <p className="text-xs text-text-secondary mb-4">For multinational OEMs</p>
                <div className="text-3xl font-extrabold text-text-primary mb-6">$4,900<span className="text-xs text-text-muted font-normal"> / mo</span></div>
                <ul className="space-y-2.5 text-xs text-text-secondary mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> Unlimited Nodes & Routes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> Real-Time Digital Twin GIS</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> Multi-Tenant Role Isolation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> Custom ERP & Webhook Ingestion</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> Dedicated Support & SLA</li>
                </ul>
              </div>
              <Link href="/dashboard" className="w-full py-2.5 rounded-lg bg-brand-blue hover:bg-brand-light text-center text-xs font-semibold text-white shadow-glow">
                Deploy Enterprise
              </Link>
            </div>

            {/* Sovereign / Air-gapped */}
            <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col justify-between">
              <div>
                <h4 className="text-base font-semibold text-text-primary mb-1">Sovereign / On-Prem</h4>
                <p className="text-xs text-text-secondary mb-4">For aerospace & defense</p>
                <div className="text-3xl font-extrabold text-text-primary mb-6">Custom</div>
                <ul className="space-y-2.5 text-xs text-text-secondary mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> Air-gapped Kubernetes Deployment</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> Local LLM & Solver Enclaves</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> SOC2 Type II & FedRAMP</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> 24/7 Operations Command</li>
                </ul>
              </div>
              <Link href="/dashboard" className="w-full py-2.5 rounded-lg bg-surface-elevated hover:bg-surface-highlight border border-border text-center text-xs font-semibold">
                Contact Defense Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/80 py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-text-secondary">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-blue to-accent-cyan flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-semibold text-text-primary">FlowChain AI</span>
            <span>— When Supply Chains Break, Intelligence Takes Over.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-text-primary">Dashboard</Link>
            <Link href="/network" className="hover:text-text-primary">Digital Twin</Link>
            <Link href="/agent-center" className="hover:text-text-primary">Agent Center</Link>
            <Link href="/recovery-center" className="hover:text-text-primary">Recovery Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
