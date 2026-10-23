"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  Sparkles,
  Zap,
  User,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export function Header() {
  const [activeOrg] = useState("Apex Microelectronics Inc.");

  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Organization context & Quick Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs text-text-primary">
          <Building2 className="w-3.5 h-3.5 text-brand-light" />
          <span className="font-medium tracking-tight">{activeOrg}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-blue/20 text-brand-light font-mono">Tenant</span>
        </div>

        <div className="relative w-80 hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search suppliers, orders, disruptions (Ctrl + K)..."
            className="w-full bg-surface-elevated border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
      </div>

      {/* Right: Quick actions, notifications, user profile */}
      <div className="flex items-center gap-4">
        {/* Quick Disruption Action Button */}
        <Link
          href="/disruptions?create=true"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-red/10 border border-status-red/30 text-status-red text-xs font-medium hover:bg-status-red/20 transition-colors shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Trigger Disruption</span>
        </Link>

        {/* Live Simulation Mode Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          <span>Twin In Sync</span>
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer p-2 rounded-lg hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-red" />
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
            SC
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-medium text-text-primary leading-tight">Dr. Sarah Chen</div>
            <div className="text-[10px] text-text-muted leading-tight font-mono">Operations Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
