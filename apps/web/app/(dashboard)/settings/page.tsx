"use client";

import { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Cpu,
  Key,
  Save,
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-accent-cyan" />
            <span>Platform Configuration & Solver Parameters</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage organization defaults, Google OR-Tools MIP solver time limits, and external AI provider keys.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-green/20 text-status-green text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configuration Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Details */}
        <div className="p-6 rounded-xl glass-panel-elevated border border-border space-y-4">
          <h3 className="text-sm font-bold text-text-primary">Organization Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-text-muted mb-1">Organization Name:</label>
              <input
                type="text"
                defaultValue="Apex Microelectronics Inc."
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-text-muted mb-1">Industry Sector:</label>
              <input
                type="text"
                defaultValue="Electronics & High-Tech Manufacturing"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Solver Configuration */}
        <div className="p-6 rounded-xl glass-panel-elevated border border-border space-y-4">
          <h3 className="text-sm font-bold text-text-primary">Google OR-Tools MIP Solver Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-text-muted mb-1">Solver Max Time Limit (ms):</label>
              <input
                type="number"
                defaultValue={5000}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-text-muted mb-1">MIP Relative Optimality Gap (%):</label>
              <input
                type="number"
                step="0.01"
                defaultValue={0.01}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-text-muted mb-1">Default Pareto Strategy:</label>
              <select
                defaultValue="Balanced"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand-blue"
              >
                <option>Balanced</option>
                <option>Cost-First</option>
                <option>Speed-First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-brand-blue hover:bg-brand-light text-white text-xs font-semibold flex items-center gap-2 shadow-glow"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
}
