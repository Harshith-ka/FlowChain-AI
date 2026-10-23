"use client";

import { useState } from "react";
import {
  Building2,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  Star
} from "lucide-react";

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const suppliers = [
    { id: "SP-01", name: "Tokyo Micro Systems", country: "Japan", reliability: 98.5, leadTimeDays: 4, moq: 500, capacity: 50000, status: "Active", certified: true },
    { id: "SP-02", name: "Formosa Silicon Ltd", country: "Taiwan", reliability: 96.2, leadTimeDays: 5, moq: 1000, capacity: 80000, status: "Active", certified: true },
    { id: "SP-03", name: "Seoul Semiconductor Corp", country: "South Korea", reliability: 95.0, leadTimeDays: 6, moq: 800, capacity: 60000, status: "Active", certified: true },
    { id: "SP-04", name: "Pacific Core Tech", country: "China", reliability: 74.0, leadTimeDays: 7, moq: 2000, capacity: 100000, status: "Disrupted", certified: true },
    { id: "SP-05", name: "Bavaria Precision Electronics", country: "Germany", reliability: 99.1, leadTimeDays: 3, moq: 200, capacity: 35000, status: "Active", certified: true },
    { id: "SP-06", name: "Austin Semiconductor Fab", country: "USA", reliability: 97.4, leadTimeDays: 3, moq: 500, capacity: 45000, status: "Active", certified: true },
    { id: "SP-07", name: "Bangalore Chipworks", country: "India", reliability: 92.8, leadTimeDays: 8, moq: 1500, capacity: 70000, status: "Active", certified: false },
    { id: "SP-08", name: "Penang Assembly Hub", country: "Malaysia", reliability: 94.6, leadTimeDays: 5, moq: 1000, capacity: 65000, status: "Active", certified: true },
  ];

  const filtered = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-brand-light" />
            <span>Supplier Management & Qualified Directory</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Evaluate supplier operational constraints, capacity limits, reliability history, and alternative replacement tiers.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-semibold flex items-center gap-2 shadow-glow transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Qualified Supplier</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-3.5 rounded-xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by supplier name or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-elevated border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-text-muted">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-brand-blue"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (7)</option>
            <option value="disrupted">Disrupted (1)</option>
          </select>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="rounded-xl glass-panel-elevated border border-border overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface/80 border-b border-border text-text-muted font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Country</th>
              <th className="py-3 px-4">Reliability</th>
              <th className="py-3 px-4">Lead Time</th>
              <th className="py-3 px-4">MOQ</th>
              <th className="py-3 px-4">Monthly Capacity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-surface-highlight/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-text-primary flex items-center gap-2">
                    <span>{s.name}</span>
                    {s.certified && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-blue/10 text-brand-light border border-brand-blue/20">
                        ISO-9001
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-text-muted font-mono">{s.id}</div>
                </td>
                <td className="py-3 px-4 text-text-secondary">{s.country}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-mono font-bold ${s.reliability >= 95 ? "text-status-green" : s.reliability >= 90 ? "text-status-amber" : "text-status-red"}`}>
                      {s.reliability}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-text-primary">{s.leadTimeDays} days</td>
                <td className="py-3 px-4 font-mono text-text-secondary">{s.moq.toLocaleString()} pcs</td>
                <td className="py-3 px-4 font-mono text-text-secondary">{s.capacity.toLocaleString()} pcs</td>
                <td className="py-3 px-4">
                  {s.status === "Active" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-green/15 text-status-green text-[10px] font-medium border border-status-green/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-red/15 text-status-red text-[10px] font-medium border border-status-red/30 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      Disrupted
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={`/network?supplier=${s.id}`}
                    className="text-xs text-brand-light hover:underline font-medium"
                  >
                    View in Twin
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
