import React, { useState } from 'react';
import { TenantInfo } from '../types';
import { Building2, Sparkles, Plus, Check, ShieldCheck, Zap } from 'lucide-react';

interface TenantHeaderProps {
  tenants: TenantInfo[];
  activeTenant: TenantInfo;
  onSelectTenant: (tenant: TenantInfo) => void;
  onCreateTenant: (name: string) => void;
}

export const TenantHeader: React.FC<TenantHeaderProps> = ({
  tenants,
  activeTenant,
  onSelectTenant,
  onCreateTenant,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');

  const handleAdd = () => {
    if (!newBusinessName.trim()) return;
    onCreateTenant(newBusinessName);
    setNewBusinessName('');
    setShowAddModal(false);
  };

  const usagePercent = Math.min(100, Math.round((activeTenant.usedMinutesThisMonth / activeTenant.includedMinutes) * 100));

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Multi-Tenant Business Switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Building2 className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Tenant Workspace:</span>
            <select
              value={activeTenant.id}
              onChange={(e) => {
                const found = tenants.find((t) => t.id === e.target.value);
                if (found) onSelectTenant(found);
              }}
              className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.planName})
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
              title="Add New Business Tenant"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Tenant Usage & Plan Meter */}
        <div className="flex items-center gap-4 text-xs">
          
          {/* Usage progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Call Usage:</span>
            <div className="w-28 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all ${
                  usagePercent > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <span className="font-mono font-bold text-slate-200 text-[11px]">
              {activeTenant.usedMinutesThisMonth}/{activeTenant.includedMinutes} Mins
            </span>
          </div>

          {/* DLT Header Badge */}
          <span className="hidden md:flex items-center gap-1 text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> DLT: {activeTenant.dltHeader}
          </span>

          {/* Plan badge */}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
            {activeTenant.razorpaySubStatus.toUpperCase()} SUBSCRIPTION
          </span>

        </div>

      </div>

      {/* Modal to add new tenant */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-indigo-500/30 bg-slate-950 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Add New Business Tenant / Client Organization
            </h3>
            <p className="text-xs text-slate-400">
              Create a isolated multi-tenant workspace with dedicated phone numbers, call logs, and DLT credentials.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Business / Clinic Name</label>
              <input
                type="text"
                value={newBusinessName}
                onChange={(e) => setNewBusinessName(e.target.value)}
                placeholder="e.g. Fortis Healthcare Indiranagar"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
