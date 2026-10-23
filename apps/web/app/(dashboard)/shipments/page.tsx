"use client";

import { useState } from "react";
import {
  Truck,
  Search,
  Filter,
  Plane,
  Ship,
  Train,
  Clock,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function ShipmentsPage() {
  const [modeFilter, setModeFilter] = useState("all");

  const shipments = [
    { id: "SH-9011", origin: "Tokyo (SP-01)", dest: "Singapore (WH-01)", carrier: "Nippon Cargo Air", mode: "Air", product: "MCU-X8", qty: 3200, plannedArrival: "2026-10-26", estArrival: "2026-10-26", status: "Expedited (Recovery)" },
    { id: "SH-9012", origin: "Shenzhen (SP-04)", dest: "Singapore (WH-01)", carrier: "Cosco Shipping", mode: "Ocean", product: "MCU-X8", qty: 10000, plannedArrival: "2026-10-25", estArrival: "2026-11-02", status: "Delayed (+7d)" },
    { id: "SH-9013", origin: "Taipei (SP-02)", dest: "Chicago (WH-03)", carrier: "Flexport Ocean", mode: "Ocean", product: "DSP-AUDIO", qty: 6000, plannedArrival: "2026-11-01", estArrival: "2026-11-01", status: "In Transit" },
    { id: "SH-9014", origin: "Frankfurt (WH-05)", dest: "Rotterdam (WH-02)", carrier: "DB Cargo Rail", mode: "Rail", product: "WIFI6-MOD", qty: 4000, plannedArrival: "2026-10-28", estArrival: "2026-10-28", status: "In Transit" },
    { id: "SH-9015", origin: "Austin Fab (SP-06)", dest: "Chicago (WH-03)", carrier: "FedEx Freight", mode: "Road", product: "PMIC-900", qty: 15000, plannedArrival: "2026-10-27", estArrival: "2026-10-27", status: "In Transit" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-accent-cyan" />
            <span>Multi-Modal Shipments & Logistics Lanes</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Active freight movement across Ocean, Express Air, Rail, and Intermodal ground transit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Mode:</span>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="bg-surface-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-brand-blue"
          >
            <option value="all">All Modes (40)</option>
            <option value="air">Air (12)</option>
            <option value="ocean">Ocean (18)</option>
            <option value="rail">Rail (4)</option>
            <option value="road">Road (6)</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="rounded-xl glass-panel-elevated border border-border overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface/80 border-b border-border text-text-muted font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Shipment ID</th>
              <th className="py-3 px-4">Lane (Origin → Dest)</th>
              <th className="py-3 px-4">Carrier</th>
              <th className="py-3 px-4">Mode</th>
              <th className="py-3 px-4">Product Cargo</th>
              <th className="py-3 px-4">Qty</th>
              <th className="py-3 px-4">Planned ETA</th>
              <th className="py-3 px-4">Est. Arrival</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {shipments.map((sh) => (
              <tr key={sh.id} className="hover:bg-surface-highlight/30 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-accent-cyan">{sh.id}</td>
                <td className="py-3 px-4 text-text-primary font-medium">{sh.origin} → {sh.dest}</td>
                <td className="py-3 px-4 text-text-secondary">{sh.carrier}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 text-text-primary font-mono text-[11px]">
                    {sh.mode === "Air" && <Plane className="w-3.5 h-3.5 text-accent-cyan" />}
                    {sh.mode === "Ocean" && <Ship className="w-3.5 h-3.5 text-brand-light" />}
                    {sh.mode === "Rail" && <Train className="w-3.5 h-3.5 text-purple-400" />}
                    {sh.mode === "Road" && <Truck className="w-3.5 h-3.5 text-status-amber" />}
                    {sh.mode}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-text-secondary">{sh.product}</td>
                <td className="py-3 px-4 font-mono text-text-primary font-medium">{formatNumber(sh.qty)}</td>
                <td className="py-3 px-4 font-mono text-text-muted">{sh.plannedArrival}</td>
                <td className="py-3 px-4 font-mono text-text-primary">{sh.estArrival}</td>
                <td className="py-3 px-4">
                  {sh.status.includes("Delayed") ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-red/15 text-status-red text-[10px] font-bold border border-status-red/30 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      {sh.status}
                    </span>
                  ) : sh.status.includes("Expedited") ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan text-[10px] font-bold border border-accent-cyan/30">
                      <Plane className="w-3 h-3" />
                      {sh.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-green/15 text-status-green text-[10px] font-medium border border-status-green/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {sh.status}
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
