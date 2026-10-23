"use client";

import { useState } from "react";
import {
  Warehouse,
  Plus,
  Boxes,
  Activity,
  ArrowUpRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function WarehousesPage() {
  const warehouses = [
    { id: "WH-01", name: "Central Hub Alpha", location: "Singapore", capacityMax: 100000, currentHoldings: 84200, handlingPerDay: 8000, costPerDay: 4500, status: "Normal" },
    { id: "WH-02", name: "Distribution Hub Beta", location: "Rotterdam, Netherlands", capacityMax: 75000, currentHoldings: 61000, handlingPerDay: 6000, costPerDay: 3800, status: "Normal" },
    { id: "WH-03", name: "Americas Midwest DC", location: "Chicago, USA", capacityMax: 120000, currentHoldings: 92400, handlingPerDay: 10000, costPerDay: 5200, status: "Normal" },
    { id: "WH-04", name: "East Asia Gateway", location: "Tokyo, Japan", capacityMax: 50000, currentHoldings: 46800, handlingPerDay: 4500, costPerDay: 3100, status: "High Utilization" },
    { id: "WH-05", name: "DACH Logistics Center", location: "Frankfurt, Germany", capacityMax: 60000, currentHoldings: 32000, handlingPerDay: 5000, costPerDay: 3400, status: "Normal" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Warehouse className="w-5 h-5 text-accent-cyan" />
            <span>Warehouses & Distribution Facilities</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Monitor regional storage constraints, throughput handling capacity, and real-time inventory utilization.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-semibold flex items-center gap-2 shadow-glow transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Warehouse Facility</span>
        </button>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((wh) => {
          const utilPercent = Math.round((wh.currentHoldings / wh.capacityMax) * 100);
          return (
            <div key={wh.id} className="p-5 rounded-xl glass-panel-elevated border border-border space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{wh.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-light" />
                    <span>{wh.location}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-muted">
                  {wh.id}
                </span>
              </div>

              {/* Utilization Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Storage Utilization:</span>
                  <span className={`font-mono font-bold ${utilPercent > 90 ? "text-status-amber" : "text-status-green"}`}>
                    {utilPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${utilPercent > 90 ? "bg-status-amber" : "bg-brand-blue"}`}
                    style={{ width: `${utilPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-text-muted font-mono">
                  <span>{formatNumber(wh.currentHoldings)} stored</span>
                  <span>{formatNumber(wh.capacityMax)} max</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/60 text-xs">
                <div>
                  <div className="text-[10px] text-text-muted uppercase">Daily Handling</div>
                  <div className="font-mono text-text-primary font-medium">{formatNumber(wh.handlingPerDay)} units/day</div>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted uppercase">Operating Cost</div>
                  <div className="font-mono text-text-primary font-medium">{formatCurrency(wh.costPerDay)}/day</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
