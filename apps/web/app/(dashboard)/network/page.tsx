"use client";

import { useState } from "react";
import {
  Globe2,
  Layers,
  Filter,
  Eye,
  Building2,
  Warehouse,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Info,
  Maximize2,
  RefreshCw
} from "lucide-react";

export default function DigitalTwinNetworkPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>("SP-04");
  const [filterMode, setFilterMode] = useState("all");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Globe2 className="w-5 h-5 text-accent-cyan" />
            <span>Supply Chain Digital Twin GIS</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time geospatial representation of suppliers, distribution centers, transportation lanes, and active disruptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <div className="flex items-center bg-surface-elevated rounded-lg p-1 border border-border text-xs">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1 rounded ${filterMode === "all" ? "bg-brand-blue text-white" : "text-text-secondary"}`}
            >
              All Lanes
            </button>
            <button
              onClick={() => setFilterMode("disrupted")}
              className={`px-2.5 py-1 rounded ${filterMode === "disrupted" ? "bg-status-red text-white" : "text-text-secondary"}`}
            >
              Disrupted
            </button>
            <button
              onClick={() => setFilterMode("recovery")}
              className={`px-2.5 py-1 rounded ${filterMode === "recovery" ? "bg-accent-cyan text-black font-semibold" : "text-text-secondary"}`}
            >
              Recovery Routes
            </button>
          </div>

          <button className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-highlight border border-border text-text-secondary hover:text-text-primary transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map + Inspection View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive GIS Visualizer (3 cols) */}
        <div className="lg:col-span-3 rounded-xl glass-panel-elevated border border-border p-4 relative min-h-[560px] flex flex-col justify-between overflow-hidden">
          {/* Map Status Bar */}
          <div className="flex items-center justify-between z-10 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/90 border border-border font-mono">
              <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
              <span>GIS Engine: Active</span>
              <span className="text-text-muted">|</span>
              <span className="text-accent-cyan">50 Active Routes</span>
            </div>

            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface/90 border border-border text-[11px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-green" /> Healthy</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-amber" /> Delayed</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-red" /> Disrupted</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-cyan" /> Proposed Reroute</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Approved Recovery</span>
            </div>
          </div>

          {/* Detailed SVG Supply Chain Topology Map */}
          <div className="absolute inset-0 pt-16 pb-8 px-6 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 900 480" fill="none">
              {/* Grid Background */}
              <pattern id="twinGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#twinGrid)" />

              {/* World outline hint paths */}
              <ellipse cx="450" cy="240" rx="420" ry="210" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="6 6" />

              {/* Normal Lanes */}
              <path d="M 160 120 Q 320 100 460 180" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
              <path d="M 160 200 Q 320 180 460 180" stroke="#10B981" strokeWidth="2" opacity="0.6" />
              <path d="M 460 180 Q 620 140 760 150" stroke="#10B981" strokeWidth="2.5" opacity="0.7" />
              <path d="M 460 300 Q 620 280 760 320" stroke="#10B981" strokeWidth="2" opacity="0.7" />
              <path d="M 460 180 L 460 300" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

              {/* Disrupted Lane: SP-04 to WH-South (Red dashed, glowing) */}
              <path d="M 160 320 Q 320 340 460 300" stroke="#EF4444" strokeWidth="3.5" strokeDasharray="6 4" />
              
              {/* Proposed Recovery Lane: SP-01 to WH-South via Express Air (Cyan pulsing) */}
              <path d="M 160 120 Q 280 260 460 300" stroke="#06B6D4" strokeWidth="3" className="animate-pulse" />

              {/* Nodes - Suppliers */}
              <g onClick={() => setSelectedNode("SP-01")} className="cursor-pointer group">
                <circle cx="160" cy="120" r="16" fill="#111827" stroke="#10B981" strokeWidth="2" />
                <circle cx="160" cy="120" r="5" fill="#10B981" />
                <text x="160" y="150" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontFamily="sans-serif">SP-01 Tokyo</text>
                <text x="160" y="162" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace">98% OTD</text>
              </g>

              <g onClick={() => setSelectedNode("SP-02")} className="cursor-pointer group">
                <circle cx="160" cy="200" r="14" fill="#111827" stroke="#10B981" strokeWidth="2" />
                <circle cx="160" cy="200" r="4" fill="#10B981" />
                <text x="160" y="228" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">SP-02 Taipei</text>
              </g>

              {/* Disrupted Node: SP-04 */}
              <g onClick={() => setSelectedNode("SP-04")} className="cursor-pointer">
                <circle cx="160" cy="320" r="22" fill="#241014" stroke="#EF4444" strokeWidth="3" className="animate-pulse" />
                <circle cx="160" cy="320" r="7" fill="#EF4444" />
                <text x="160" y="356" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="bold" fontFamily="sans-serif">SP-04 Shenzhen</text>
                <text x="160" y="370" textAnchor="middle" fill="#F87171" fontSize="9" fontFamily="monospace">OFFLINE (7d)</text>
              </g>

              {/* Nodes - Warehouses */}
              <g onClick={() => setSelectedNode("WH-01")} className="cursor-pointer">
                <rect x="442" y="162" width="36" height="36" rx="8" fill="#1B2435" stroke="#3B82F6" strokeWidth="2" />
                <circle cx="460" cy="180" r="5" fill="#3B82F6" />
                <text x="460" y="214" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="semibold" fontFamily="sans-serif">Central Hub Alpha</text>
                <text x="460" y="226" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">Singapore</text>
              </g>

              <g onClick={() => setSelectedNode("WH-02")} className="cursor-pointer">
                <rect x="442" y="282" width="36" height="36" rx="8" fill="#1B2435" stroke="#06B6D4" strokeWidth="2" />
                <circle cx="460" cy="300" r="5" fill="#06B6D4" />
                <text x="460" y="334" textAnchor="middle" fill="#06B6D4" fontSize="11" fontWeight="semibold" fontFamily="sans-serif">Distribution Hub Beta</text>
                <text x="460" y="346" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">Rotterdam</text>
              </g>

              {/* Nodes - Customers */}
              <g onClick={() => setSelectedNode("CUST-NA")} className="cursor-pointer">
                <polygon points="760,135 776,165 744,165" fill="#111827" stroke="#10B981" strokeWidth="2" />
                <circle cx="760" cy="155" r="4" fill="#10B981" />
                <text x="760" y="184" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontFamily="sans-serif">NA Assembly Cluster</text>
                <text x="760" y="196" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace">Demand: 18,000</text>
              </g>

              <g onClick={() => setSelectedNode("CUST-EU")} className="cursor-pointer">
                <polygon points="760,305 776,335 744,335" fill="#111827" stroke="#3B82F6" strokeWidth="2" />
                <circle cx="760" cy="325" r="4" fill="#3B82F6" />
                <text x="760" y="354" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontFamily="sans-serif">EU Automotive OEM</text>
                <text x="760" y="366" textAnchor="middle" fill="#3B82F6" fontSize="9" fontFamily="monospace">Demand: 12,500</text>
              </g>
            </svg>
          </div>

          {/* Bottom Zoom & Timeline bar */}
          <div className="z-10 flex items-center justify-between text-xs text-text-muted border-t border-border/60 pt-3">
            <span>Projection: WGS84 Web Mercator</span>
            <div className="flex items-center gap-2 font-mono">
              <span>Coordinates: 22.5431° N, 114.0579° E</span>
              <span>Zoom: 3.4x</span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Entity Inspection Panel (1 col) */}
        <div className="rounded-xl glass-panel-elevated border border-border p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-light" />
              <span>Entity Inspector</span>
            </h3>
            <span className="font-mono text-xs text-text-muted">{selectedNode}</span>
          </div>

          {selectedNode === "SP-04" ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-status-red/10 border border-status-red/30 text-status-red">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Disrupted Node: Supplier SP-04</span>
                </div>
                <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                  Facility shut down due to factory fire. Production halted for 7 calendar days.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-muted">Entity Name:</span>
                  <span className="font-medium text-text-primary">Pacific Core Tech</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-muted">Location:</span>
                  <span className="font-medium text-text-primary">Shenzhen, China</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-muted">Affected SKUs:</span>
                  <span className="font-medium text-text-primary font-mono">MCU-X8, RAM-32G</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-muted">Volume at Risk:</span>
                  <span className="font-bold text-status-red font-mono">14,200 Units</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-muted">Customer Orders Affected:</span>
                  <span className="font-bold text-status-amber font-mono">12 Orders</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/recovery-center"
                  className="w-full py-2 px-3 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-glow transition-all"
                >
                  <span>Solve Recovery in Center</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface border border-border">
                <div className="font-bold text-text-primary">Entity: {selectedNode}</div>
                <p className="mt-1 text-[11px] text-text-secondary">
                  Operational and performing within normal telemetry bounds.
                </p>
              </div>
              <p className="text-text-muted text-[11px]">Click on any node or transportation edge on the GIS map to inspect constraints, capacity, and active shipments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
