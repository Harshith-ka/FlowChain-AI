"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("90d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-brand-light" />
            <span>Supply Chain Analytics & Solver Performance</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Operational KPIs, documented cost avoidance against unoptimized baselines, and mathematical solver execution statistics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-elevated rounded-lg p-1 border border-border text-xs">
          {["30d", "90d", "YTD", "All Time"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 rounded ${timeRange === t ? "bg-brand-blue text-white" : "text-text-secondary hover:text-text-primary"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-border">
          <div className="text-xs text-text-muted mb-1">Documented Cost Savings</div>
          <div className="text-2xl font-bold text-status-green font-mono">$412,800</div>
          <div className="text-[11px] text-text-secondary mt-1">Vs unoptimized expediting</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-border">
          <div className="text-xs text-text-muted mb-1">On-Time Delivery SLA</div>
          <div className="text-2xl font-bold text-text-primary font-mono">98.2%</div>
          <div className="text-[11px] text-status-green mt-1">+4.6% vs pre-FlowChain</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-border">
          <div className="text-xs text-text-muted mb-1">Avg Resolution Time</div>
          <div className="text-2xl font-bold text-accent-cyan font-mono">4.2 min</div>
          <div className="text-[11px] text-text-secondary mt-1">Vs 4.5 days manual triage</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-border">
          <div className="text-xs text-text-muted mb-1">OR-Tools Mean Solver Time</div>
          <div className="text-2xl font-bold text-brand-light font-mono">18.4 ms</div>
          <div className="text-[11px] text-text-secondary mt-1">0.0% optimality gap</div>
        </div>
      </div>

      {/* Analytics Charts & Benchmarks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Resiliency Trends */}
        <div className="p-5 rounded-xl glass-panel-elevated border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Network Health & Resiliency Index</h3>
            <span className="text-xs font-mono text-status-green font-bold">94.8 Avg</span>
          </div>

          <div className="h-56 bg-surface rounded-lg border border-border flex items-end justify-between p-4 gap-2">
            {[88, 91, 89, 94, 92, 96, 95, 93, 97, 98, 96, 99].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-brand-blue to-accent-cyan transition-all hover:brightness-125"
                  style={{ height: `${val - 50}%` }}
                />
                <span className="text-[10px] text-text-muted font-mono">W{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Disruption Incidents Resolved */}
        <div className="p-5 rounded-xl glass-panel-elevated border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Disruption Resolutions by Type</h3>
            <span className="text-xs font-mono text-text-secondary">24 Resolved YTD</span>
          </div>

          <div className="space-y-3 text-xs pt-2">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-text-secondary">Supplier Facility Shutdowns:</span>
                <span className="font-mono text-text-primary font-bold">8 incidents (100% recovered)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface"><div className="h-full bg-status-red rounded-full" style={{ width: '35%' }} /></div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-text-secondary">Port Congestion & Transit Delays:</span>
                <span className="font-mono text-text-primary font-bold">11 incidents (100% recovered)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface"><div className="h-full bg-brand-blue rounded-full" style={{ width: '45%' }} /></div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-text-secondary">Regional Demand Spikes:</span>
                <span className="font-mono text-text-primary font-bold">5 incidents (100% recovered)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface"><div className="h-full bg-accent-cyan rounded-full" style={{ width: '20%' }} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
