import React, { useState } from 'react';
import { TenantInfo } from '../types';
import { 
  ShieldAlert, Building2, Users, TrendingUp, DollarSign, LogIn, 
  Plus, Search, ShieldCheck, Power, RefreshCw, Key, ArrowUpRight, CheckCircle2, Zap, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuperAdminStudioProps {
  tenants: TenantInfo[];
  onImpersonateTenant: (tenant: TenantInfo) => void;
  onCreateTenant: (name: string, email: string, plan: string, minutes: number) => void;
  onToggleTenantStatus: (tenantId: string) => void;
}

export const SuperAdminStudio: React.FC<SuperAdminStudioProps> = ({
  tenants,
  onImpersonateTenant,
  onCreateTenant,
  onToggleTenantStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [showProvisionModal, setShowProvisionModal] = useState(false);

  // New Tenant Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'Starter (₹4,999/mo)' | 'Pro (₹9,999/mo)'>('Starter (₹4,999/mo)');
  const [minutes, setMinutes] = useState(300);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.dltHeader.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && t.razorpaySubStatus === 'active') ||
      (statusFilter === 'suspended' && t.razorpaySubStatus === 'suspended');

    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    if (!name.trim() || !email.trim()) return;
    onCreateTenant(name, email, plan, minutes);
    setName('');
    setEmail('');
    setShowProvisionModal(false);
    try {
      confetti({ particleCount: 30, spread: 60 });
    } catch (e) {}
  };

  const totalMrr = tenants.reduce((acc, t) => {
    return acc + (t.planName.includes('Pro') ? 9999 : 4999);
  }, 0);

  const totalMinutesUsed = tenants.reduce((acc, t) => acc + t.usedMinutesThisMonth, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Platform Owner Super Admin Console
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-emerald-400 font-medium">Multi-Tenant Management</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Super Admin Control Center</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Monitor system-wide MRR, manage client tenant organizations, configure master API keys, and log into any tenant workspace with 1 click.
          </p>
        </div>

        <button
          onClick={() => setShowProvisionModal(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-purple-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" /> Provision New Tenant
        </button>
      </div>

      {/* Platform-Wide Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Platform MRR</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">₹{totalMrr.toLocaleString()}</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +14%
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Active Client Tenants</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-indigo-400 font-mono">{tenants.length} Tenants</span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">100% Active</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Minutes Processed</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-purple-400 font-mono">{totalMinutesUsed} Mins</span>
            <span className="text-xs text-slate-400">Avg 300 mins/tenant</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Platform Uptime & Telephony</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 99.98%
            </span>
            <span className="text-xs text-slate-400">Exotel SIP Healthy</span>
          </div>
        </div>

      </div>

      {/* Tenant Search & Filter Toolbar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tenant name, owner email, DLT header..."
              className="input-field w-full pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="input-field cursor-pointer"
          >
            <option value="all">All Tenant Statuses</option>
            <option value="active">Active Subscriptions</option>
            <option value="suspended">Suspended Accounts</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing <strong className="text-white">{filteredTenants.length}</strong> of {tenants.length} Organizations
        </span>
      </div>

      {/* TENANTS MANAGEMENT TABLE */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Tenant Business / Organization</th>
                <th className="px-6 py-4">Owner Email</th>
                <th className="px-6 py-4">Subscription Plan</th>
                <th className="px-6 py-4">Monthly Call Usage</th>
                <th className="px-6 py-4">TRAI DLT Header</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Super Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTenants.map((t) => {
                const usagePct = Math.round((t.usedMinutesThisMonth / t.includedMinutes) * 100);
                const isSuspended = t.razorpaySubStatus === 'suspended';
                return (
                  <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                    
                    {/* Tenant Name */}
                    <td className="px-6 py-4 font-bold text-white text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{t.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-normal">ID: {t.id}</span>
                    </td>

                    {/* Owner Email */}
                    <td className="px-6 py-4 text-slate-300 font-mono">
                      {t.ownerEmail}
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4 font-bold text-indigo-300">
                      {t.planName}
                    </td>

                    {/* Usage Progress */}
                    <td className="px-6 py-4 space-y-1">
                      <div className="font-mono text-xs font-bold text-slate-200">
                        {t.usedMinutesThisMonth} / {t.includedMinutes} Mins
                      </div>
                      <div className="w-24 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full ${usagePct > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-indigo-500'}`}
                          style={{ width: `${Math.min(100, usagePct)}%` }}
                        />
                      </div>
                    </td>

                    {/* DLT Header */}
                    <td className="px-6 py-4 font-mono text-emerald-400 font-bold text-xs">
                      {t.dltHeader}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        isSuspended
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {t.razorpaySubStatus.toUpperCase()}
                      </span>
                    </td>

                    {/* Impersonate & Manage Buttons */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onImpersonateTenant(t)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                        title="Log in & manage this tenant's workspace"
                      >
                        <LogIn className="w-3.5 h-3.5" /> Log in as Tenant
                      </button>

                      <button
                        onClick={() => onToggleTenantStatus(t.id)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                          isSuspended
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                        title={isSuspended ? 'Reactivate Subscription' : 'Suspend Tenant Account'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROVISION NEW TENANT MODAL */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-purple-500/30 bg-slate-950 p-8 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                Provision New Client Business Tenant
              </h3>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Business / Client Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saffron Luxury Boutique Resort & Spa"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Owner Account Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. generalmanager@saffronresort.com"
                  className="input-field w-full font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Subscription Tier</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="input-field w-full cursor-pointer"
                  >
                    <option value="Starter (₹4,999/mo)">Starter (₹4,999/mo)</option>
                    <option value="Pro (₹9,999/mo)">Pro (₹9,999/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Included Call Minutes</label>
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="input-field w-full font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowProvisionModal(false)}
                className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/25"
              >
                Provision Tenant Workspace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
