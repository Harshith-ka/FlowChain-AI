"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe2,
  Building2,
  Warehouse,
  Boxes,
  ShoppingCart,
  Truck,
  AlertTriangle,
  GitCompare,
  Sliders,
  Bot,
  BarChart3,
  FileSpreadsheet,
  Layers,
  Users,
  Settings,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Command Core",
    items: [
      { title: "Command Center", href: "/dashboard", icon: LayoutDashboard },
      { title: "Digital Twin", href: "/network", icon: Globe2, badge: "GIS" },
    ]
  },
  {
    title: "Supply Chain Assets",
    items: [
      { title: "Suppliers", href: "/suppliers", icon: Building2 },
      { title: "Warehouses", href: "/warehouses", icon: Warehouse },
      { title: "Inventory", href: "/inventory", icon: Boxes },
      { title: "Orders", href: "/orders", icon: ShoppingCart },
      { title: "Shipments", href: "/shipments", icon: Truck },
    ]
  },
  {
    title: "Autonomous Recovery",
    items: [
      { title: "Disruptions", href: "/disruptions", icon: AlertTriangle, badge: "Live", badgeColor: "bg-status-red/20 text-status-red border-status-red/40" },
      { title: "Recovery Center", href: "/recovery-center", icon: GitCompare, badge: "Action", badgeColor: "bg-status-amber/20 text-status-amber border-status-amber/40" },
      { title: "Scenario Simulator", href: "/scenario-simulator", icon: Sliders },
      { title: "Agent Center", href: "/agent-center", icon: Bot, badge: "6 Agents", badgeColor: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40" },
    ]
  },
  {
    title: "Analytics & System",
    items: [
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
      { title: "Reports", href: "/reports", icon: FileSpreadsheet },
      { title: "Integrations", href: "/integrations", icon: Layers },
      { title: "Team & Access", href: "/team", icon: Users },
      { title: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-surface border-r border-border flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-border flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-blue to-accent-cyan flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-text-primary flex items-center gap-1.5">
              FlowChain <span className="text-xs px-1.5 py-0.5 rounded bg-brand-blue/20 text-brand-light font-mono border border-brand-blue/30">AI</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-none">Autonomous Resiliency</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group",
                      isActive
                        ? "bg-surface-elevated text-text-primary border border-brand-blue/40 shadow-sm"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-brand-light" : "text-text-muted group-hover:text-text-primary")} />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border font-mono font-medium", item.badgeColor || "bg-surface-highlight text-text-secondary border-border")}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-border bg-surface-secondary/50">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-surface-elevated/40 border border-border text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
            <span className="text-text-secondary">Agents Active</span>
          </div>
          <span className="font-mono text-status-green font-semibold">6/6 ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
