import React, { useState } from 'react';
import { TenantInfo, UserRole } from '../types';
import { 
  PhoneCall, ShieldCheck, TrendingUp, Sparkles, PlusCircle, Calendar, 
  CreditCard, BarChart3, Key, Building2, Plus, ChevronLeft, ChevronRight,
  Bot, MessageSquare, Smartphone, X, Menu, Layers, ShieldAlert, LogOut, UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'builder' | 'logs' | 'appointments' | 'analytics' | 'whatsapp' | 'trai' | 'integrations' | 'billing' | 'economics' | 'super_admin';
  setActiveTab: (tab: 'builder' | 'logs' | 'appointments' | 'analytics' | 'whatsapp' | 'trai' | 'integrations' | 'billing' | 'economics' | 'super_admin') => void;
  tenants: TenantInfo[];
  activeTenant: TenantInfo;
  onSelectTenant: (tenant: TenantInfo) => void;
  onCreateTenant: (name: string) => void;
  onNewAgent: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isImpersonating: boolean;
  onExitImpersonation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  tenants,
  activeTenant,
  onSelectTenant,
  onCreateTenant,
  onNewAgent,
  mobileOpen,
  setMobileOpen,
  userRole,
  setUserRole,
  isImpersonating,
  onExitImpersonation,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');

  const handleAddTenant = () => {
    if (!newBusinessName.trim()) return;
    onCreateTenant(newBusinessName);
    setNewBusinessName('');
    setShowAddModal(false);
  };

  const usagePercent = Math.min(100, Math.round((activeTenant.usedMinutesThisMonth / activeTenant.includedMinutes) * 100));

  const navItems = [
    { id: 'builder', label: 'Agent Studio', icon: Bot, group: 'CORE PLATFORM' },
    { id: 'logs', label: 'Call Logs', icon: PhoneCall, group: 'CORE PLATFORM', badge: 'LIVE' },
    { id: 'appointments', label: 'Bookings & Calendar', icon: Calendar, group: 'CORE PLATFORM' },
    { id: 'analytics', label: 'Call Analytics', icon: BarChart3, group: 'CORE PLATFORM' },
    { id: 'whatsapp', label: 'WhatsApp Bot Studio', icon: MessageSquare, group: 'CORE PLATFORM', badge: 'NEW' },
    { id: 'trai', label: 'TRAI & DPDP', icon: ShieldCheck, group: 'COMPLIANCE & SYSTEM' },
    { id: 'integrations', label: 'API & Telephony Keys', icon: Key, group: 'COMPLIANCE & SYSTEM' },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard, group: 'COMPLIANCE & SYSTEM' },
    { id: 'economics', label: 'Unit Economics', icon: TrendingUp, group: 'COMPLIANCE & SYSTEM' },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`glass-panel border-r border-slate-800 bg-slate-950/95 flex flex-col justify-between transition-all duration-300 z-50 shrink-0 h-screen sticky top-0 ${
          mobileOpen 
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl' 
            : 'hidden lg:flex ' + (collapsed ? 'w-20' : 'w-64')
        }`}
      >
        
        {/* Top Header & Brand */}
        <div className="p-4 border-b border-slate-800/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <PhoneCall className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="space-y-0.5 truncate">
                  <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1">
                    VocalFlow AI
                  </h1>
                  <span className="text-[10px] font-semibold text-indigo-400 block truncate">
                    Indian AI Receptionist SaaS
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Mode Badge / Switcher */}
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 p-2 rounded-xl text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-purple-300">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{userRole === 'super_admin' ? 'SUPER ADMIN MODE' : 'TENANT WORKSPACE'}</span>
              </div>
              <button
                onClick={() => {
                  if (userRole === 'super_admin') {
                    setUserRole('tenant_admin');
                    setActiveTab('builder');
                  } else {
                    setUserRole('super_admin');
                    setActiveTab('super_admin');
                  }
                }}
                className="text-[9px] bg-purple-600 hover:bg-purple-500 text-white font-bold px-2 py-0.5 rounded transition-colors"
              >
                {userRole === 'super_admin' ? 'Switch Tenant' : 'Super Admin'}
              </button>
            </div>
          )}

          {/* Tenant Workspace Switcher */}
          {(!collapsed || mobileOpen) && (
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-indigo-400" /> Tenant Workspace
                </span>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              <select
                value={activeTenant.id}
                onChange={(e) => {
                  const found = tenants.find((t) => t.id === e.target.value);
                  if (found) onSelectTenant(found);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer truncate"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {/* Usage meter bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Call Usage</span>
                  <span className="font-bold text-slate-200">{activeTenant.usedMinutesThisMonth}/{activeTenant.includedMinutes} Mins</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all ${
                      usagePercent > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items (Scrollable Body) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          
          {/* Super Admin Control Center Item */}
          {userRole === 'super_admin' && (
            <div className="space-y-1">
              {(!collapsed || mobileOpen) && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-3 block mb-2">
                  SUPER ADMIN PLATFORM
                </span>
              )}
              <button
                onClick={() => {
                  setActiveTab('super_admin');
                  setMobileOpen(false);
                }}
                className={`w-full p-2.5 rounded-xl transition-all flex items-center justify-between text-xs font-bold ${
                  activeTab === 'super_admin'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-purple-300 hover:bg-purple-950/40 hover:text-white border border-purple-500/20'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <ShieldAlert className="w-4 h-4 text-purple-300 shrink-0" />
                  {(!collapsed || mobileOpen) && <span className="truncate">Super Admin Console</span>}
                </div>
                {(!collapsed || mobileOpen) && (
                  <span className="px-1.5 py-0.2 text-[9px] bg-purple-500/30 text-purple-200 font-bold rounded">
                    OWNER
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Core Platform Group */}
          <div className="space-y-1">
            {(!collapsed || mobileOpen) && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
                Core Platform
              </span>
            )}
            {navItems.filter(i => i.group === 'CORE PLATFORM').map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl transition-all flex items-center justify-between text-xs font-semibold ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
                  </div>
                  {(!collapsed || mobileOpen) && item.badge && (
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                      item.badge === 'NEW' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* System & Settings Group */}
          <div className="space-y-1">
            {(!collapsed || mobileOpen) && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
                System & Compliance
              </span>
            )}
            {navItems.filter(i => i.group === 'COMPLIANCE & SYSTEM').map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl transition-all flex items-center gap-3 text-xs font-semibold ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>

        </div>

        {/* Bottom Profile & CTA */}
        <div className="p-3 border-t border-slate-800 space-y-3 shrink-0">
          {isImpersonating && (!collapsed || mobileOpen) && (
            <button
              onClick={onExitImpersonation}
              className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit Tenant Impersonation
            </button>
          )}

          {(!collapsed || mobileOpen) && (
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">DLT Header</span>
                <span className="font-mono font-bold text-emerald-400 text-[10px]">{activeTenant.dltHeader}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">SaaS Margin</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">~68.4% Net</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              onNewAgent();
              setMobileOpen(false);
            }}
            className={`w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 ${
              (collapsed && !mobileOpen) ? 'px-0' : 'px-3'
            }`}
            title="Create New Agent"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Create Agent</span>}
          </button>
        </div>

        {/* Add Tenant Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="glass-panel w-full max-w-md rounded-2xl border border-indigo-500/30 bg-slate-950 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" /> Add New Business Tenant
              </h3>
              <div className="space-y-2">
                <label className="text-xs text-slate-300 block">Business / Clinic Name</label>
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
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTenant}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          </div>
        )}

      </aside>
    </>
  );
};
