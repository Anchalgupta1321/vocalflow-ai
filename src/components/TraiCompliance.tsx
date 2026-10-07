import React, { useState } from 'react';
import { MOCK_TRAI_CONSENTS } from '../data/mockData';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Lock, Clock, 
  Search, Info, FileText, Database, PhoneCall, ExternalLink, ShieldAlert
} from 'lucide-react';

export const TraiCompliance: React.FC = () => {
  const [dndSearchNumber, setDndSearchNumber] = useState('');
  const [dndResult, setDndResult] = useState<{ searched: boolean; isDnd: boolean; statusText: string } | null>(null);
  const [recordingConsentEnabled, setRecordingConsentEnabled] = useState(true);
  const [piiMaskingEnabled, setPiiMaskingEnabled] = useState(true);

  const handleCheckDnd = () => {
    if (!dndSearchNumber.trim()) return;
    const clean = dndSearchNumber.replace(/\D/g, '');
    const isDnd = clean.endsWith('5') || clean.endsWith('9'); // Mock check
    setDndResult({
      searched: true,
      isDnd,
      statusText: isDnd 
        ? 'BLOCKED BY TRAI NCPR DND REGISTRY (Do Not Call Outbound without Explicit Proof of Consent)'
        : 'CLEAN: Number is NOT registered on DND. Outbound Service Call Allowed within 09:00 AM - 08:00 PM IST.'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> TRAI TCCCPR Regulations & Sept 2026 Amendments
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-indigo-300 font-mono">DPDP Act Compliant</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Telecom & Privacy Compliance Suite</h2>
          <p className="text-sm text-slate-400">
            Architected to safeguard your startup from telemarketing fines, DND violations, and Indian telecom regulations.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Inbound AI Receptionist Mode: SAFE
          </div>
          <p className="text-[11px] text-slate-400">Customer initiated calls carry zero telemarketing restrictions.</p>
        </div>
      </div>

      {/* 3-Tier Risk Architecture Diagram */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400" />
          Classification of AI Phone Calls in India (TRAI Framework)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Phase 1: Inbound Receptionist */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                PHASE 1 — RECOMMENDED MVP
              </span>
              <span className="text-xs font-bold text-emerald-400">Zero Risk 🟢</span>
            </div>

            <h4 className="text-sm font-bold text-white">Inbound AI Receptionist</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer calls your business phone number → AI answers FAQs, checks pricing, and books appointments.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <p className="text-emerald-300">✓ No DND scrubbing needed</p>
              <p className="text-emerald-300">✓ No telemarketer licensing needed</p>
              <p className="text-emerald-300">✓ Full privacy consent via initial IVR</p>
            </div>
          </div>

          {/* Phase 2: Consent Outbound */}
          <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
                PHASE 2 — SERVICE OUTBOUND
              </span>
              <span className="text-xs font-bold text-amber-400">Low Risk 🟡</span>
            </div>

            <h4 className="text-sm font-bold text-white">Consent-Based Outbound</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Callback requests, appointment confirmation reminders, and explicit opt-in web form follow-ups.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <p className="text-amber-300">✓ Requires opt-in timestamp log</p>
              <p className="text-amber-300">✓ Time windows: 09:00 AM – 08:00 PM IST</p>
              <p className="text-amber-300">✓ Principal Entity (PE) DLT Header</p>
            </div>
          </div>

          {/* Phase 3: Bulk Robocalls */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-400 rounded border border-rose-500/30">
                PHASE 3 — BULK PROMOTIONAL
              </span>
              <span className="text-xs font-bold text-rose-400">High Risk 🔴</span>
            </div>

            <h4 className="text-sm font-bold text-white">Unsolicited Cold Calling</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uploading 10,000 phone numbers and broadcasting promotional AI sales pitches.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <p className="text-rose-300">⚠️ Mandatory NCPR DND Scrubbing</p>
              <p className="text-rose-300">⚠️ Risk of 10-digit number disconnection</p>
              <p className="text-rose-300">⚠️ TRAI Telemarketer License required</p>
            </div>
          </div>

        </div>
      </div>

      {/* DND SCRUBBING & CONSENT LEDGER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Interactive DND Scrubbing Tool */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              Real-time TRAI NCPR DND Scrubbing Simulator
            </h4>
            <p className="text-xs text-slate-400">
              Test any Indian phone number against the National Customer Preference Register.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={dndSearchNumber}
              onChange={(e) => setDndSearchNumber(e.target.value)}
              placeholder="Enter 10-digit mobile (e.g. +91 98450 12345)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCheckDnd}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all shrink-0"
            >
              Scrub Number
            </button>
          </div>

          {dndResult && (
            <div className={`p-4 rounded-xl text-xs space-y-2 border ${
              dndResult.isDnd
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}>
              <div className="font-bold flex items-center gap-2">
                {dndResult.isDnd ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {dndResult.isDnd ? 'TRAI DND REGISTRATION DETECTED' : 'CLEAN FOR CALLING'}
              </div>
              <p>{dndResult.statusText}</p>
            </div>
          )}
        </div>

        {/* DPDP Privacy Toggles */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              DPDP Act (Digital Personal Data Protection) Rules
            </h4>
            <p className="text-xs text-slate-400">
              Enforce consent disclosures and call recording privacy controls.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="font-bold text-white block">Call Recording Consent Greeting</span>
                <span className="text-[11px] text-slate-400">Plays "This call is recorded for quality & training"</span>
              </div>
              <input
                type="checkbox"
                checked={recordingConsentEnabled}
                onChange={(e) => setRecordingConsentEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="font-bold text-white block">Auto-Redact PII in Transcripts</span>
                <span className="text-[11px] text-slate-400">Mask Aadhaar, PAN, and card numbers automatically</span>
              </div>
              <input
                type="checkbox"
                checked={piiMaskingEnabled}
                onChange={(e) => setPiiMaskingEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
            </div>
          </div>
        </div>

      </div>

      {/* CONSENT PROOF LEDGER TABLE */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Audit Trail: Customer Consent Vault (TCCCPR Rule 12)
            </h4>
            <p className="text-xs text-slate-400">Immutable ledger proving explicit opt-in for outbound callbacks.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">Consent ID</th>
                <th className="px-4 py-3">Customer Mobile</th>
                <th className="px-4 py-3">Opt-in Source</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">PE Reg ID</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_TRAI_CONSENTS.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-mono font-bold text-indigo-300">{c.id}</td>
                  <td className="px-4 py-3 font-mono">{c.customerPhone}</td>
                  <td className="px-4 py-3">{c.consentType}</td>
                  <td className="px-4 py-3 text-slate-400">{c.grantedAt}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{c.peRegistrationId}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded font-bold border border-emerald-500/30">
                      ACTIVE CONSENT
                    </span>
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
