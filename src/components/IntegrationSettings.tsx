import React, { useState } from 'react';
import { Key, Phone, Volume2, Calendar, MessageSquare, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const IntegrationSettings: React.FC = () => {
  const [groqKey, setGroqKey] = useState('gsk_live_98a7b6c5d4e3f2a1b0c9d8e7');
  const [elevenlabsKey, setElevenlabsKey] = useState('el_live_99a8b7c6d5e4f3a2b1c0d9e8');
  const [exotelSid, setExotelSid] = useState('exotel_sub_2991048293');
  const [whatsappToken, setWhatsappToken] = useState('EAAG9018472938472938472938');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Key className="w-3.5 h-3.5" /> API Keys & Telephony Integration Hub
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-emerald-400 font-medium">BYOK (Bring Your Own Key) Ready</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">API & Telephony Integrations</h2>
          <p className="text-sm text-slate-400">
            Connect your Groq LLM key (Llama-3.3-70b), ElevenLabs voice, Exotel/Twilio SIP trunks, and Meta WhatsApp Business credentials.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Zap className="w-4 h-4" />}
          {saved ? 'Credentials Saved!' : 'Save Integration Keys'}
        </button>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Groq LLM API Key */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xs">
                GROQ
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Groq LLM Engine (Llama-3.3-70b)</h3>
                <p className="text-[11px] text-amber-300/80">Ultra-fast ~300ms Intent Extraction & Speech Agent</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
              ACTIVE (~500 t/s)
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 block">Groq API Key (`gsk_...`)</label>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        
        {/* ElevenLabs API Key */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">ElevenLabs Voice API Key</h3>
                <p className="text-[11px] text-slate-400">TTS & Conversational Voice Agent API</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              CONNECTED
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 block">ElevenLabs Secret API Key</label>
            <input
              type="password"
              value={elevenlabsKey}
              onChange={(e) => setElevenlabsKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Exotel / Twilio Telephony Credentials */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Exotel / Twilio India Trunk</h3>
                <p className="text-[11px] text-slate-400">SIP Webhooks & Virtual Phone Numbers</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              ACTIVE (+91 80 4719)
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 block">Exotel Account SID / API Key</label>
            <input
              type="text"
              value={exotelSid}
              onChange={(e) => setExotelSid(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Google Calendar OAuth Status */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Calendar OAuth 2.0</h3>
                <p className="text-[11px] text-slate-400">Real-time Appointment Slot Verification</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              SYNCED
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Connected to <strong>Dr. Sharma Main Appointments (Google Calendar)</strong> with auto-hold enabled.
          </p>
        </div>

        {/* Meta WhatsApp Cloud API */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Meta WhatsApp Cloud API</h3>
                <p className="text-[11px] text-slate-400">Post-Call Automated Dispatches</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              CONNECTED
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 block">System User Access Token</label>
            <input
              type="password"
              value={whatsappToken}
              onChange={(e) => setWhatsappToken(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
