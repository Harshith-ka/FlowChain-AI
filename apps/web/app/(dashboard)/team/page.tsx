"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Mail
} from "lucide-react";

export default function TeamPage() {
  const [members] = useState([
    { name: "Dr. Sarah Chen", email: "sarah.chen@apex.com", role: "Organization Owner", status: "Active" },
    { name: "Marcus Vance", email: "marcus.vance@apex.com", role: "Operations Admin", status: "Active" },
    { name: "Elena Rostova", email: "elena.r@apex.com", role: "Supply Chain Manager", status: "Active" },
    { name: "David Kim", email: "david.kim@apex.com", role: "Logistics Manager", status: "Active" },
    { name: "Priya Patel", email: "priya.p@apex.com", role: "Procurement Manager", status: "Active" },
    { name: "Auditor Desk", email: "compliance@apex.com", role: "Viewer", status: "Active" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Users className="w-5 h-5 text-brand-light" />
            <span>Team Access & Multi-Tenant Role Isolation (RBAC)</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage organization members, recovery plan sign-off privileges, and data access tiers.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-semibold flex items-center gap-2 shadow-glow">
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      <div className="rounded-xl glass-panel-elevated border border-border overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface/80 border-b border-border text-text-muted font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">RBAC Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {members.map((m) => (
              <tr key={m.email} className="hover:bg-surface-highlight/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-text-primary">{m.name}</td>
                <td className="py-3 px-4 text-text-secondary font-mono">{m.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-surface border border-border text-[11px] font-mono font-medium text-brand-light">
                    {m.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-green/15 text-status-green text-[10px] font-medium border border-status-green/30">
                    <CheckCircle2 className="w-3 h-3" />
                    {m.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-text-muted hover:text-text-primary text-xs">Edit Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
