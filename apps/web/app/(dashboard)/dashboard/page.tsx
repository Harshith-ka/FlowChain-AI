"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Truck,
  AlertTriangle,
  Boxes,
  ShoppingCart,
  GitCompare,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Globe2,
  Zap
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function CommandCenterDashboard() {
  // Operational state defaults (wired to live backend APIs in Phase 2)
  const [metrics] = useState({
    activeSuppliers: 8,
    activeShipments: 40,
    delayedShipments: 6,
    inventoryAtRisk: 14200,
    openDisruptions: 1,
    ordersAtRisk: 12,
    recoveryPlansPending: 2,
    estimatedRecoveryCost: 18450,
    healthScore: 91.4,
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Active Disruption Alert & Quick Recovery CTA */}
      <div className="rounded-xl bg-gradient-to-r from-status-red/15 via-surface-elevated to-surface-elevated border border-status-red/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-status-red/20 border border-status-red/40 flex items-center justify-center text-status-red flex-shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-status-red uppercase tracking-wider font-mono">Disruption Active</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-red/20 text-status-red border border-status-red/30 font-semibold">
                Tier 1 Critical
              </span>
            </div>
            <p className="text-xs text-text-primary font-medium mt-0.5">
              Pacific Core Tech (Shenzhen) reported complete 7-day facility shutdown. 12 Customer orders at immediate risk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/recovery-center"
            className="px-4 py-2 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-semibold flex items-center gap-2 shadow-glow transition-all"
          >
            <span>Review Recovery Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/scenario-simulator"
            className="px-3.5 py-2 rounded-lg bg-surface hover:bg-surface-highlight border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-all"
          >
            Simulate
          </Link>
        </div>
      </div>

      {/* 8 Primary Operational KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl glass-panel border border-border hover:border-brand-blue/40 transition-colors">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Active Suppliers</span>
            <Building2 className="w-4 h-4 text-brand-light" />
          </div>
          <div className="text-2xl font-bold text-text-primary">{metrics.activeSuppliers}</div>
          <div className="text-[11px] text-text-muted mt-1 flex items-center gap-1">
            <span className="text-status-green font-medium">7 Healthy</span> • <span className="text-status-red font-medium">1 Disrupted</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl glass-panel border border-border hover:border-brand-blue/40 transition-colors">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Active Shipments</span>
            <Truck className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="text-2xl font-bold text-text-primary">{metrics.activeShipments}</div>
          <div className="text-[11px] text-text-muted mt-1 flex items-center gap-1">
            <span className="text-status-green font-medium">34 In Transit</span> • <span>6 At Risk</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl glass-panel border border-border hover:border-status-red/40 transition-colors">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Delayed Shipments</span>
            <Clock className="w-4 h-4 text-status-amber" />
          </div>
          <div className="text-2xl font-bold text-status-amber">{metrics.delayedShipments}</div>
          <div className="text-[11px] text-text-muted mt-1">
            Avg +3.2 days transit delay
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl glass-panel border border-border hover:border-brand-blue/40 transition-colors">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Inventory At Risk</span>
            <Boxes className="w-4 h-4 text-status-red" />
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatNumber(metrics.inventoryAtRisk)} <span className="text-xs text-text-muted font-normal">units</span></div>
          <div className="text-[11px] text-status-red mt-1 font-medium">
            3 SKUs below safety stock
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-xl glass-panel border border-border hover:border-status-red/40 transition-colors">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Open Disruptions</span>
            <AlertTriangle className="w-4 h-4 text-status-red" />
          </div>
          <div className="text-2xl font-bold text-status-red">{metrics.openDisruptions}</div>
          <div className="text-[11px] text-text-muted mt-1">
            Supplier Failure (Shenzhen)
          </div>
        </div>

        {/* KPI 6 */}
        <div className="p-4 rounded-xl glass-panel border border-border hover:border-brand-blue/40 transition-colors">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Orders At Risk</span>
            <ShoppingCart className="w-4 h-4 text-status-amber" />
          </div>
          <div className="text-2xl font-bold text-status-amber">{metrics.ordersAtRisk}</div>
          <div className="text-[11px] text-text-muted mt-1">
            $384,000 revenue exposure
          </div>
        </div>

        {/* KPI 7 */}
        <div className="p-4 rounded-xl glass-panel border border-border hover:border-brand-blue/40 transition-colors">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Recovery Plans</span>
            <GitCompare className="w-4 h-4 text-brand-light" />
          </div>
          <div className="text-2xl font-bold text-brand-light">{metrics.recoveryPlansPending} <span className="text-xs text-text-muted font-normal">ready</span></div>
          <div className="text-[11px] text-accent-cyan mt-1 font-medium">
            Pending Manager Sign-off
          </div>
        </div>

        {/* KPI 8 */}
        <div className="p-4 rounded-xl glass-panel border border-border hover:border-brand-blue/40 transition-colors">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Est. Recovery Cost</span>
            <DollarSign className="w-4 h-4 text-status-green" />
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatCurrency(metrics.estimatedRecoveryCost)}</div>
          <div className="text-[11px] text-status-green mt-1 font-medium">
            Saves $92,000 late penalties
          </div>
        </div>
      </div>

      {/* Main Grid: Live Disruption & Health Status + Compact Digital Twin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Disruption Details & Agent Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Live Disruption Feed */}
          <div className="rounded-xl glass-panel-elevated p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-status-red" />
                <h3 className="text-sm font-semibold text-text-primary">Live Disruption Feed</h3>
              </div>
              <Link href="/disruptions" className="text-xs text-brand-light hover:underline flex items-center gap-1">
                <span>View all disruptions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-surface border border-status-red/30 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-primary">Pacific Core Tech Facility Fire</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-status-red/20 text-status-red font-mono font-medium">
                      Supplier Failure
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Shenzhen facility offline for estimated 7 days. Key components: Microcontroller MCU-X8, High-Density RAM Module.
                  </p>
                  <div className="text-[11px] text-text-muted flex items-center gap-4 pt-1">
                    <span>Started: Oct 23, 14:00 UTC</span>
                    <span>Confidence: 94%</span>
                    <span className="text-status-amber">Impact: 12 Orders</span>
                  </div>
                </div>

                <Link
                  href="/recovery-center"
                  className="px-3 py-1.5 rounded bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-light border border-brand-blue/30 text-xs font-medium flex-shrink-0"
                >
                  View Recovery
                </Link>
              </div>
            </div>
          </div>

          {/* Section: Pending Recovery Proposals */}
          <div className="rounded-xl glass-panel-elevated p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <GitCompare className="w-4 h-4 text-brand-light" />
                <h3 className="text-sm font-semibold text-text-primary">Pending Multi-Objective Recovery Strategies</h3>
              </div>
              <Link href="/recovery-center" className="text-xs text-brand-light hover:underline flex items-center gap-1">
                <span>Compare & Approve</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Option 1 */}
              <div className="p-3.5 rounded-lg bg-surface border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text-primary">Strategy A: Cost-First</span>
                  <span className="font-mono text-status-green font-bold">$12,400</span>
                </div>
                <p className="text-[11px] text-text-secondary mb-3">
                  Reroute from Warehouse B via ground freight. 88% on-time fulfillment.
                </p>
                <div className="text-[10px] text-text-muted font-mono">2 Days Delayed</div>
              </div>

              {/* Option 2 (Recommended) */}
              <div className="p-3.5 rounded-lg bg-surface border-2 border-brand-blue shadow-glow relative">
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-brand-blue text-[9px] font-mono text-white font-bold uppercase">
                  Recommended
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-accent-cyan">Strategy B: Balanced</span>
                  <span className="font-mono text-accent-cyan font-bold">$18,450</span>
                </div>
                <p className="text-[11px] text-text-secondary mb-3">
                  Source from Tokyo + Express Air for priority orders. 98.4% on-time.
                </p>
                <div className="text-[10px] text-status-green font-mono">0 Days Delayed</div>
              </div>

              {/* Option 3 */}
              <div className="p-3.5 rounded-lg bg-surface border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text-primary">Strategy C: Speed-First</span>
                  <span className="font-mono text-status-amber font-bold">$29,800</span>
                </div>
                <p className="text-[11px] text-text-secondary mb-3">
                  All-air chartered shipment for 100% orders. Maximum velocity.
                </p>
                <div className="text-[10px] text-text-muted font-mono">0 Days Delayed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Digital Twin Preview & Quick Network Health */}
        <div className="space-y-6">
          {/* Digital Twin Mini-Viewer */}
          <div className="rounded-xl glass-panel-elevated p-5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-sm font-semibold text-text-primary">Digital Twin Preview</h3>
              </div>
              <Link href="/network" className="text-xs text-brand-light hover:underline flex items-center gap-1">
                <span>Expand GIS</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Mini Map Canvas Box */}
            <div className="h-52 bg-[#050914] rounded-lg border border-border relative flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full p-2" viewBox="0 0 300 180" fill="none">
                {/* Simplified routes */}
                <path d="M 40 40 L 150 90" stroke="#10B981" strokeWidth="1.5" />
                <path d="M 40 140 L 150 90" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M 150 90 L 260 50" stroke="#10B981" strokeWidth="1.5" />
                <path d="M 150 90 L 260 130" stroke="#06B6D4" strokeWidth="2" strokeDasharray="2 2" />

                {/* Nodes */}
                <circle cx="40" cy="40" r="8" fill="#10B981" />
                <circle cx="40" cy="140" r="10" fill="#EF4444" className="animate-pulse" />
                <rect x="140" y="80" width="20" height="20" rx="4" fill="#3B82F6" />
                <circle cx="260" cy="50" r="7" fill="#10B981" />
                <circle cx="260" cy="130" r="8" fill="#06B6D4" />
              </svg>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-surface/90 px-2 py-1 rounded border border-border text-text-muted">
                Nodes: 16 | Routes: 50
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
              <span>Network Resiliency Score</span>
              <span className="font-mono text-status-green font-bold">91.4 / 100</span>
            </div>
          </div>

          {/* Six Agents Quick Observability */}
          <div className="rounded-xl glass-panel-elevated p-5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-sm font-semibold text-text-primary">AI Agents Status</h3>
              </div>
              <Link href="/agent-center" className="text-xs text-brand-light hover:underline">
                Agent Center
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-surface border border-border">
                <span className="text-text-secondary">Disruption Intelligence</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-green/20 text-status-green">IDLE</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface border border-border">
                <span className="text-text-secondary">Supplier Recovery</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-green/20 text-status-green">READY</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface border border-border">
                <span className="text-text-secondary">OR-Tools MIP Solver</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-blue/20 text-brand-light">SOLVED (18ms)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface border border-border">
                <span className="text-text-secondary">Recovery Orchestrator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-amber/20 text-status-amber">AWAITING APPROVAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
