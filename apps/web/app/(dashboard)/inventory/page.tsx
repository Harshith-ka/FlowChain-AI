"use client";

import { useState } from "react";
import {
  Boxes,
  Search,
  Filter,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  TrendingDown
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const items = [
    { sku: "MCU-X8", name: "High-Performance Microcontroller 32-bit", warehouse: "Central Hub Alpha (Singapore)", onHand: 4200, reserved: 3800, atp: 400, threshold: 2500, unitCost: 14.50, risk: "Critical Shortage" },
    { sku: "RAM-32G", name: "DDR5 High-Density RAM Module", warehouse: "Central Hub Alpha (Singapore)", onHand: 2800, reserved: 2600, atp: 200, threshold: 1800, unitCost: 28.00, risk: "High Risk" },
    { sku: "DSP-AUDIO", name: "Low-Power Audio DSP Processor", warehouse: "East Asia Gateway (Tokyo)", onHand: 15400, reserved: 4200, atp: 11200, threshold: 3000, unitCost: 8.20, risk: "Healthy Buffer" },
    { sku: "PMIC-900", name: "Integrated Power Management IC", warehouse: "Americas Midwest DC (Chicago)", onHand: 22000, reserved: 7500, atp: 14500, threshold: 5000, unitCost: 3.40, risk: "Healthy Buffer" },
    { sku: "WIFI6-MOD", name: "Wi-Fi 6E / BT 5.3 RF Module", warehouse: "Distribution Hub Beta (Rotterdam)", onHand: 8500, reserved: 6800, atp: 1700, threshold: 2000, unitCost: 11.00, risk: "Moderate Risk" },
    { sku: "OLED-4K", name: "Micro-OLED Display Driver", warehouse: "DACH Logistics (Frankfurt)", onHand: 12000, reserved: 3000, atp: 9000, threshold: 2500, unitCost: 35.00, risk: "Healthy Buffer" },
  ];

  const filtered = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Boxes className="w-5 h-5 text-status-amber" />
            <span>Inventory Positions & Available-to-Promise (ATP)</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Strict multi-echelon inventory conservation ledger preventing double allocations and stockouts.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-surface-highlight border border-border text-text-primary text-xs font-semibold flex items-center gap-2 transition-all">
          <ArrowRightLeft className="w-4 h-4 text-brand-light" />
          <span>Propose Warehouse Transfer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3.5 rounded-xl border border-border flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by SKU or component name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-elevated border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue"
          />
        </div>
        <div className="text-xs text-text-muted font-mono">
          Strict Conservation Enforced: Yes
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl glass-panel-elevated border border-border overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface/80 border-b border-border text-text-muted font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">SKU / Product</th>
              <th className="py-3 px-4">Warehouse Facility</th>
              <th className="py-3 px-4">On Hand</th>
              <th className="py-3 px-4">Reserved</th>
              <th className="py-3 px-4">Available (ATP)</th>
              <th className="py-3 px-4">Safety Threshold</th>
              <th className="py-3 px-4">Unit Cost</th>
              <th className="py-3 px-4">Risk Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((item) => (
              <tr key={item.sku} className="hover:bg-surface-highlight/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-text-primary">{item.name}</div>
                  <div className="text-[10px] font-mono text-brand-light">{item.sku}</div>
                </td>
                <td className="py-3 px-4 text-text-secondary">{item.warehouse}</td>
                <td className="py-3 px-4 font-mono font-medium text-text-primary">{formatNumber(item.onHand)}</td>
                <td className="py-3 px-4 font-mono text-status-amber">{formatNumber(item.reserved)}</td>
                <td className="py-3 px-4 font-mono font-bold text-accent-cyan">{formatNumber(item.atp)}</td>
                <td className="py-3 px-4 font-mono text-text-muted">{formatNumber(item.threshold)}</td>
                <td className="py-3 px-4 font-mono text-text-secondary">{formatCurrency(item.unitCost)}</td>
                <td className="py-3 px-4">
                  {item.risk === "Critical Shortage" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-red/15 text-status-red text-[10px] font-semibold border border-status-red/30 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      Critical Shortage
                    </span>
                  ) : item.risk === "High Risk" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-amber/15 text-status-amber text-[10px] font-medium border border-status-amber/30">
                      High Risk
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-green/15 text-status-green text-[10px] font-medium border border-status-green/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Healthy Buffer
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
