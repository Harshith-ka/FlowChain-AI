"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  FileText,
  CheckCircle2,
  Share2
} from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { title: "Q3 Disruption Resilience & SLA Audit Report", type: "Executive Audit", format: "PDF", size: "2.4 MB", date: "2026-10-20" },
    { title: "Shenzhen Facility Disruption Post-Mortem & Recovery Ledger", type: "Incident Debrief", format: "PDF", size: "1.8 MB", date: "2026-10-23" },
    { title: "Multi-Echelon Inventory Conservation & Flow Conservation Export", type: "Regulatory", format: "CSV", size: "640 KB", date: "2026-10-22" },
    { title: "Carrier Performance & On-Time Transit Benchmark", type: "Operational", format: "XLSX", size: "1.1 MB", date: "2026-10-15" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-accent-cyan" />
            <span>Executive Reports & Audit Compliance</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Export mathematical optimization ledgers, recovery incident debriefs, and SLA penalty audit logs.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-semibold flex items-center gap-2 shadow-glow">
          <Download className="w-4 h-4" />
          <span>Generate Custom Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="p-5 rounded-xl glass-panel-elevated border border-border flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-brand-light">
                  {r.type}
                </span>
                <span className="text-xs text-text-muted">{r.date}</span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary">{r.title}</h3>
              <p className="text-xs text-text-secondary font-mono">{r.format} • {r.size}</p>
            </div>

            <button className="p-2.5 rounded-lg bg-surface hover:bg-surface-highlight border border-border text-text-secondary hover:text-text-primary transition-colors flex-shrink-0">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
