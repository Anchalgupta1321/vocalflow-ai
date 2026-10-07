import React from 'react';
import { 
  BarChart3, TrendingUp, Users, PhoneCall, Clock, CheckCircle2, 
  Smile, Frown, Meh, ArrowUpRight, ShieldCheck 
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> Real-time Call Intelligence & AI Performance
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-emerald-400 font-medium">94.8% First-Call Resolution</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Receptionist Analytics</h2>
          <p className="text-sm text-slate-400">
            Deep insights into call volumes, caller sentiment, peak hours, and appointment conversion rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-right space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Response Time</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">310 ms</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Total Inbound Volume</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">1,240 Calls</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +18.4%
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Appointments Booked</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-indigo-400">382 Slots</span>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded font-medium">30.8% Conv.</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Human Escalation Rate</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-amber-400">5.2%</span>
            <span className="text-xs text-slate-400">Only 64 calls</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Caller CSAT Score</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-400">4.9 / 5.0</span>
            <span className="text-xs text-slate-400">98% Positive</span>
          </div>
        </div>

      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Peak Calling Hours Histogram Visual */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Hourly Call Volume Distribution (24 Hours)
          </h3>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
            {[
              { hour: '8 AM', height: '20%', calls: 35 },
              { hour: '9 AM', height: '55%', calls: 92 },
              { hour: '10 AM', height: '85%', calls: 145 },
              { hour: '11 AM', height: '100%', calls: 180 },
              { hour: '12 PM', height: '75%', calls: 125 },
              { hour: '1 PM', height: '40%', calls: 65 },
              { hour: '2 PM', height: '60%', calls: 98 },
              { hour: '3 PM', height: '70%', calls: 115 },
              { hour: '4 PM', height: '90%', calls: 160 },
              { hour: '5 PM', height: '80%', calls: 135 },
              { hour: '6 PM', height: '50%', calls: 80 },
              { hour: '7 PM', height: '30%', calls: 50 },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 border border-slate-700 text-[10px] text-white px-2 py-0.5 rounded font-mono pointer-events-none whitespace-nowrap">
                  {bar.calls} Calls
                </div>
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-md hover:from-indigo-500 hover:to-purple-400 transition-all cursor-pointer"
                  style={{ height: bar.height }}
                />
                <span className="text-[9px] text-slate-400 font-mono">{bar.hour}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
            <span>🔥 Peak Hours: <strong>10:00 AM – 11:30 AM</strong> & <strong>04:00 PM – 05:30 PM</strong></span>
            <span className="text-emerald-400 font-semibold">100% AI Concurrency (Zero Busy Tones)</span>
          </div>
        </div>

        {/* Sentiment Distribution Pie Visual */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smile className="w-4 h-4 text-emerald-400" />
            Caller Sentiment Breakdown
          </h3>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5" /> Satisfied / Booked (78%)
                </span>
                <span className="font-mono text-white">967 Calls</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Meh className="w-3.5 h-3.5" /> Neutral FAQ Inquiries (17%)
                </span>
                <span className="font-mono text-white">209 Calls</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-indigo-500 rounded-full w-[17%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <Frown className="w-3.5 h-3.5" /> Escalated / Urgent (5%)
                </span>
                <span className="font-mono text-white">64 Calls</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-rose-500 rounded-full w-[5%]" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
