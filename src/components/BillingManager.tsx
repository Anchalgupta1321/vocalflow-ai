import React from 'react';
import { TenantInfo } from '../types';
import { CreditCard, CheckCircle2, Download, Zap, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

interface BillingManagerProps {
  tenant: TenantInfo;
}

export const BillingManager: React.FC<BillingManagerProps> = ({ tenant }) => {
  const mockInvoices = [
    { id: 'INV-2026-009', date: '2026-10-01', amount: '₹4,999.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-2026-008', date: '2026-09-01', amount: '₹4,999.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-2026-007', date: '2026-08-01', amount: '₹4,999.00', status: 'Paid', downloadUrl: '#' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Razorpay Subscriptions & Metered Billing
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-emerald-400 font-medium">Auto-Debit Active</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Tenant Billing & Metered Usage</h2>
          <p className="text-sm text-slate-400">
            Manage your subscription plan, view call minute balances, and download tax invoices.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 text-right space-y-1 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Active Plan</span>
          <span className="text-lg font-bold text-white">{tenant.planName}</span>
          <span className="text-[11px] text-emerald-400 block font-medium">Renews on {tenant.nextBillingDate}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Usage Progress */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Monthly Minute Allowance
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Minutes Used</span>
              <span className="text-indigo-400 font-mono">{tenant.usedMinutesThisMonth} / {tenant.includedMinutes} Mins</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (tenant.usedMinutesThisMonth / tenant.includedMinutes) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Need more minutes? Extra call time is billed at ₹12/minute automatically at cycle end.
            </p>
          </div>

          <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Top-Up 500 Extra Minutes (₹4,500)
          </button>
        </div>

        {/* Payment Method */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-400" />
            Saved Razorpay Payment Method
          </h3>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-white">
              <span className="font-bold">HDFC Bank Corporate UPI / Card</span>
              <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">AUTOPAY ON</span>
            </div>
            <p className="text-slate-400 text-[11px]">•••• •••• •••• 4480</p>
            <p className="text-[10px] text-slate-500">Sub ID: sub_Raz990184729</p>
          </div>

          <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors">
            Update Payment Method
          </button>
        </div>

        {/* Tax Info */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            GSTIN & Business Tax Profile
          </h3>

          <div className="space-y-1.5 text-xs text-slate-300">
            <p>• <strong>Business Name:</strong> {tenant.name}</p>
            <p>• <strong>GSTIN:</strong> 29AAAAA0000A1Z5 (Karnataka)</p>
            <p>• <strong>DLT Entity ID:</strong> {tenant.dltEntityId}</p>
            <p>• <strong>Registered Email:</strong> {tenant.ownerEmail}</p>
          </div>
        </div>

      </div>

      {/* Invoice History */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Invoice History & Downloads</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Billing Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-4 py-3 font-mono font-bold text-indigo-300">{inv.id}</td>
                  <td className="px-4 py-3 text-slate-400">{inv.date}</td>
                  <td className="px-4 py-3 font-mono text-white font-bold">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 font-bold rounded">
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium inline-flex items-center gap-1">
                      <Download className="w-3 h-3" /> PDF Tax Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
