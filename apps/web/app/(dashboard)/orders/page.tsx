"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function OrdersPage() {
  const [tab, setTab] = useState<"customer" | "purchase">("customer");

  const customerOrders = [
    { id: "CO-1042", customer: "Apex North America OEM", product: "MCU-X8", quantity: 3000, deadline: "2026-10-27", priority: "Critical", penaltyPerDay: 5000, status: "Delayed Risk" },
    { id: "CO-1043", customer: "Apex North America OEM", product: "RAM-32G", quantity: 2000, deadline: "2026-10-28", priority: "Critical", penaltyPerDay: 3500, status: "Delayed Risk" },
    { id: "CO-1044", customer: "EuroAuto Tier 1 Systems", product: "DSP-AUDIO", quantity: 4500, deadline: "2026-11-02", priority: "High", penaltyPerDay: 2000, status: "On Track" },
    { id: "CO-1045", customer: "Nordic Tech Instruments", product: "PMIC-900", quantity: 8000, deadline: "2026-11-05", priority: "Medium", penaltyPerDay: 1000, status: "On Track" },
    { id: "CO-1046", customer: "AeroDynamics Silicon", product: "WIFI6-MOD", quantity: 1500, deadline: "2026-10-29", priority: "High", penaltyPerDay: 2500, status: "At Risk" },
  ];

  const purchaseOrders = [
    { id: "PO-8801", supplier: "Pacific Core Tech (Shenzhen)", product: "MCU-X8", quantity: 10000, arrival: "2026-10-25", unitPrice: 14.50, status: "Disrupted (Shutdown)" },
    { id: "PO-8802", supplier: "Tokyo Micro Systems", product: "DSP-AUDIO", quantity: 8000, arrival: "2026-10-29", unitPrice: 8.20, status: "In Transit" },
    { id: "PO-8803", supplier: "Bavaria Precision Electronics", product: "OLED-4K", quantity: 3000, arrival: "2026-11-01", unitPrice: 35.00, status: "Processing" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-brand-light" />
            <span>Order Pipeline & Customer SLA Commitments</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Track contractual fulfillment commitments, required delivery deadlines, and penalty liability exposures.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-surface-elevated rounded-lg p-1 border border-border text-xs">
          <button
            onClick={() => setTab("customer")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${tab === "customer" ? "bg-brand-blue text-white" : "text-text-secondary hover:text-text-primary"}`}
          >
            Customer Orders (100)
          </button>
          <button
            onClick={() => setTab("purchase")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${tab === "purchase" ? "bg-brand-blue text-white" : "text-text-secondary hover:text-text-primary"}`}
          >
            Purchase Orders (30)
          </button>
        </div>
      </div>

      {tab === "customer" ? (
        <div className="rounded-xl glass-panel-elevated border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface/80 border-b border-border text-text-muted font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer Destination</th>
                <th className="py-3 px-4">Product Component</th>
                <th className="py-3 px-4">Order Qty</th>
                <th className="py-3 px-4">Deadline SLA</th>
                <th className="py-3 px-4">Priority Tier</th>
                <th className="py-3 px-4">Delay Penalty</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {customerOrders.map((co) => (
                <tr key={co.id} className="hover:bg-surface-highlight/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-brand-light">{co.id}</td>
                  <td className="py-3 px-4 text-text-primary font-medium">{co.customer}</td>
                  <td className="py-3 px-4 font-mono text-text-secondary">{co.product}</td>
                  <td className="py-3 px-4 font-mono text-text-primary">{formatNumber(co.quantity)}</td>
                  <td className="py-3 px-4 font-mono text-text-secondary">{co.deadline}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${co.priority === "Critical" ? "bg-status-red/20 text-status-red border border-status-red/40" : co.priority === "High" ? "bg-status-amber/20 text-status-amber border border-status-amber/40" : "bg-surface text-text-muted border border-border"}`}>
                      {co.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-status-red font-medium">{formatCurrency(co.penaltyPerDay)}/day</td>
                  <td className="py-3 px-4">
                    {co.status === "Delayed Risk" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-red/15 text-status-red text-[10px] font-medium border border-status-red/30 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        Delayed Risk
                      </span>
                    ) : co.status === "At Risk" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-amber/15 text-status-amber text-[10px] font-medium border border-status-amber/30">
                        At Risk
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-green/15 text-status-green text-[10px] font-medium border border-status-green/30">
                        <CheckCircle2 className="w-3 h-3" />
                        On Track
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl glass-panel-elevated border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface/80 border-b border-border text-text-muted font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier Source</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Planned Arrival</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-surface-highlight/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-accent-cyan">{po.id}</td>
                  <td className="py-3 px-4 text-text-primary font-medium">{po.supplier}</td>
                  <td className="py-3 px-4 font-mono text-text-secondary">{po.product}</td>
                  <td className="py-3 px-4 font-mono text-text-primary">{formatNumber(po.quantity)}</td>
                  <td className="py-3 px-4 font-mono text-text-secondary">{po.arrival}</td>
                  <td className="py-3 px-4 font-mono text-text-primary">{formatCurrency(po.unitPrice)}</td>
                  <td className="py-3 px-4">
                    {po.status.includes("Disrupted") ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-red/15 text-status-red text-[10px] font-bold border border-status-red/30">
                        <AlertTriangle className="w-3 h-3" />
                        {po.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-green/15 text-status-green text-[10px] font-medium border border-status-green/30">
                        <CheckCircle2 className="w-3 h-3" />
                        {po.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
