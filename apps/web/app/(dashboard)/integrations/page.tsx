"use client";

import { useState } from "react";
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings,
  RefreshCw
} from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    { name: "SAP S/4HANA Cloud", category: "Enterprise ERP", status: "Connected", syncFrequency: "Real-time Webhook", iconText: "SAP" },
    { name: "Oracle NetSuite", category: "Inventory & POs", status: "Connected", syncFrequency: "15 min polling", iconText: "ORA" },
    { name: "Flexport Freight Forwarding", category: "Carrier Telemetry", status: "Connected", syncFrequency: "Push Webhook", iconText: "FLX" },
    { name: "project44 Ocean & Air Visibility", category: "GPS & AIS Tracking", status: "Connected", syncFrequency: "5 min AIS feed", iconText: "P44" },
    { name: "Maersk EDI Network", category: "Ocean Carrier", status: "Configured", syncFrequency: "Hourly EDI 214", iconText: "MSK" },
    { name: "Microsoft Dynamics 365 SCM", category: "ERP", status: "Available", syncFrequency: "Manual setup", iconText: "D365" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-brand-light" />
            <span>Enterprise ERP & Carrier Telemetry Integrations</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Connect ERP inventory ledgers, purchase order pipelines, and real-time shipping carrier webhooks.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-surface-highlight border border-border text-text-primary text-xs font-semibold flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>Sync All Connectors</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div key={item.name} className="p-5 rounded-xl glass-panel-elevated border border-border space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center font-bold text-xs text-brand-light font-mono">
                  {item.iconText}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{item.name}</h3>
                  <div className="text-xs text-text-muted">{item.category}</div>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${item.status === "Connected" ? "bg-status-green/20 text-status-green border border-status-green/30" : "bg-surface text-text-muted border border-border"}`}>
                {item.status}
              </span>
            </div>

            <div className="text-xs text-text-secondary pt-3 border-t border-border/60 flex items-center justify-between">
              <span>Sync Cadence:</span>
              <span className="font-mono text-text-primary">{item.syncFrequency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
