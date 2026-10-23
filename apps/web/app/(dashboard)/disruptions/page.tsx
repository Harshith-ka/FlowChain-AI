"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Plus,
  Play,
  Zap,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Building2,
  Boxes,
  ShoppingCart
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function DisruptionsPage() {
  const [showModal, setShowModal] = useState(false);
  const [disruptionType, setDisruptionType] = useState("Supplier failure");
  const [severity, setSeverity] = useState("Critical");
  const [durationDays, setDurationDays] = useState(7);
  const [affectedEntity, setAffectedEntity] = useState("Pacific Core Tech (SP-04)");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-status-red" />
            <span>Disruption Intelligence & Impact Blast-Radius</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Detect, simulate, and calculate graph-traversal impact across purchase orders, regional inventory, and customer commitments.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-lg bg-status-red hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-2 shadow-glow-red transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Report / Trigger Disruption</span>
        </button>
      </div>

      {/* Active Disruption Detailed Card */}
      <div className="p-6 rounded-xl glass-panel-elevated border-2 border-status-red/40 relative shadow-glow-red space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-red/20 border border-status-red/40 flex items-center justify-center text-status-red animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary">Pacific Core Tech Factory Fire</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-red/20 text-status-red border border-status-red/30 font-semibold font-mono">
                  CRITICAL SEVERITY
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Shenzhen, China • Type: Supplier Facility Shutdown • Expected Duration: 7 Days
              </p>
            </div>
          </div>

          <Link
            href="/recovery-center"
            className="px-4 py-2 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-semibold flex items-center gap-2 shadow-glow"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Multi-Agent Recovery</span>
          </Link>
        </div>

        {/* Impact Calculations 4-Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
              <ShoppingCart className="w-4 h-4 text-status-red" />
              <span>Affected Customer Orders</span>
            </div>
            <div className="text-2xl font-bold text-status-red font-mono">12 Orders</div>
            <div className="text-[11px] text-text-muted mt-1">$384,000 Contract Value</div>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
              <Boxes className="w-4 h-4 text-status-amber" />
              <span>Volume at Immediate Risk</span>
            </div>
            <div className="text-2xl font-bold text-status-amber font-mono">14,200 Units</div>
            <div className="text-[11px] text-text-muted mt-1">SKUs: MCU-X8, RAM-32G</div>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
              <Clock className="w-4 h-4 text-brand-light" />
              <span>First Stockout Projected</span>
            </div>
            <div className="text-2xl font-bold text-text-primary font-mono">In 3 Days</div>
            <div className="text-[11px] text-text-muted mt-1">Oct 26, 2026 (Central Hub)</div>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
              <TrendingDown className="w-4 h-4 text-status-red" />
              <span>Potential Penalty Exposure</span>
            </div>
            <div className="text-2xl font-bold text-status-red font-mono">$92,000</div>
            <div className="text-[11px] text-text-muted mt-1">Contractual Late SLA Fees</div>
          </div>
        </div>

        {/* Critical Dependency Path Visual */}
        <div className="p-4 rounded-lg bg-surface border border-border">
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono mb-3">
            Deterministic Graph Traversal Critical Path
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-status-red/15 text-status-red border border-status-red/30 font-medium font-mono">
              [Supplier] Pacific Core Tech (Shenzhen)
            </span>
            <ArrowRight className="w-4 h-4 text-text-muted" />
            <span className="px-3 py-1.5 rounded-lg bg-surface-elevated text-text-secondary border border-border font-mono">
              [PO] PO-8801 (10,000 units MCU-X8)
            </span>
            <ArrowRight className="w-4 h-4 text-text-muted" />
            <span className="px-3 py-1.5 rounded-lg bg-status-amber/15 text-status-amber border border-status-amber/30 font-mono">
              [Hub] Central Hub Alpha (Stockout Risk)
            </span>
            <ArrowRight className="w-4 h-4 text-text-muted" />
            <span className="px-3 py-1.5 rounded-lg bg-status-red/15 text-status-red border border-status-red/30 font-bold font-mono">
              [Customer] Apex NA OEM Cluster (CO-1042 SLA Breach)
            </span>
          </div>
        </div>
      </div>

      {/* Disruption Trigger Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-elevated border border-border rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-status-red" />
                <span>Simulate New Disruption Event</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-text-muted mb-1">Disruption Type:</label>
                <select
                  value={disruptionType}
                  onChange={(e) => setDisruptionType(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand-blue"
                >
                  <option>Supplier failure</option>
                  <option>Shipment delay</option>
                  <option>Warehouse shutdown</option>
                  <option>Inventory shortage</option>
                  <option>Transportation capacity reduction</option>
                  <option>Demand surge</option>
                  <option>Route disruption</option>
                </select>
              </div>

              <div>
                <label className="block text-text-muted mb-1">Affected Entity:</label>
                <input
                  type="text"
                  value={affectedEntity}
                  onChange={(e) => setAffectedEntity(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1">Severity:</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand-blue"
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Expected Duration (Days):</label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-3.5 py-2 rounded-lg bg-surface border border-border text-text-secondary text-xs hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  alert("Disruption registered! Impact analysis generated.");
                }}
                className="px-4 py-2 rounded-lg bg-status-red hover:bg-red-600 text-white text-xs font-semibold shadow-glow-red"
              >
                Trigger & Calculate Impact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
